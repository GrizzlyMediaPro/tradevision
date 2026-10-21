/**
 * Copiază toate colecțiile, documentele (cu același _id) și indecșii
 * din DATABASE_URL în DATABASE_URL_TARGET.
 *
 * Nu înlocui DATABASE_URL înainte de clonare: aplicația și sursa rămân pe baza actuală.
 *
 *   node scripts/clone-mongo.mjs --dry-run
 *   node scripts/clone-mongo.mjs
 */
import { readFileSync } from "node:fs";
import { MongoClient } from "mongodb";

const BATCH_SIZE = 200;
const dryRun = process.argv.includes("--dry-run");

function loadEnvFile(filePath) {
  const env = {};
  const text = readFileSync(filePath, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

function safe(error) {
  const message = error instanceof Error ? error.message : String(error);
  return message.replace(/mongodb(\+srv)?:\/\/\S+/gi, "mongodb://***");
}

function identity(uri) {
  const normalized = uri
    .replace(/^mongodb\+srv:\/\//, "https://")
    .replace(/^mongodb:\/\//, "http://");
  let parsed;
  try {
    parsed = new URL(normalized);
  } catch {
    throw new Error(
      "Connection string invalid. Include numele bazei, de forma ...mongodb.net/NumeBaza",
    );
  }
  const db = decodeURIComponent(parsed.pathname.replace(/^\//, "").split("/")[0] || "");
  if (!db) {
    throw new Error(
      "Connection string fără nume de bază. Adaugă-l la final, de exemplu /TradeVision",
    );
  }
  return { host: parsed.host, db };
}

function indexSpec(index) {
  const spec = { key: index.key, name: index.name };
  for (const field of [
    "unique",
    "sparse",
    "expireAfterSeconds",
    "partialFilterExpression",
    "collation",
    "hidden",
    "wildcardProjection",
  ]) {
    if (index[field] !== undefined) spec[field] = index[field];
  }
  return spec;
}

function collectionOptions(info) {
  const options = info.options ?? {};
  const picked = {};
  for (const field of [
    "validator",
    "validationLevel",
    "validationAction",
    "collation",
    "capped",
    "size",
    "max",
  ]) {
    if (options[field] !== undefined) picked[field] = options[field];
  }
  return picked;
}

async function copyCollection(srcDb, dstDb, info) {
  const name = info.name;
  const srcCol = srcDb.collection(name);
  const indexes = (await srcCol.indexes()).filter((index) => index.name !== "_id_");
  const total = await srcCol.countDocuments();

  if (dryRun) {
    console.log(`${name}: ${total} documente, ${indexes.length} indecși`);
    return { name, total };
  }

  const existing = await dstDb.listCollections({ name }).toArray();
  if (existing.length > 0) {
    await dstDb.collection(name).drop();
  }
  await dstDb.createCollection(name, collectionOptions(info));

  const dstCol = dstDb.collection(name);
  let copied = 0;
  let batch = [];
  const cursor = srcCol.find({}, { batchSize: BATCH_SIZE });
  for await (const doc of cursor) {
    batch.push(doc);
    if (batch.length >= BATCH_SIZE) {
      await dstCol.insertMany(batch, { ordered: true });
      copied += batch.length;
      batch = [];
    }
  }
  if (batch.length > 0) {
    await dstCol.insertMany(batch, { ordered: true });
    copied += batch.length;
  }

  if (indexes.length > 0) {
    await dstCol.createIndexes(indexes.map(indexSpec));
  }

  const targetCount = await dstCol.countDocuments();
  if (targetCount !== total) {
    throw new Error(
      `${name}: sursa are ${total} documente, destinația are ${targetCount}`,
    );
  }

  console.log(`${name}: ${copied} documente, ${indexes.length} indecși`);
  return { name, total: copied };
}

async function main() {
  const env = loadEnvFile(new URL("../.env", import.meta.url));
  const sourceUrl = env.DATABASE_URL?.trim();
  const targetUrl = env.DATABASE_URL_TARGET?.trim();

  if (!sourceUrl) {
    throw new Error("Lipsește DATABASE_URL în .env");
  }
  if (!dryRun && !targetUrl) {
    throw new Error(
      "Lipsește DATABASE_URL_TARGET în .env. Nu înlocui DATABASE_URL; adaugă cheia nouă separat.",
    );
  }

  const sourceId = identity(sourceUrl);
  if (!dryRun) {
    const targetId = identity(targetUrl);
    if (sourceId.host === targetId.host && sourceId.db === targetId.db) {
      throw new Error(
        "Sursa și destinația sunt aceeași bază. Oprire, ca să nu se șteargă datele curente.",
      );
    }
    console.log(`Destinație: ${targetId.host} / ${targetId.db}`);
  }
  console.log(`Sursă: ${sourceId.host} / ${sourceId.db}`);
  console.log(dryRun ? "Mod: inventar, fără scriere" : "Mod: copiere completă");

  const source = new MongoClient(sourceUrl, { serverSelectionTimeoutMS: 20000 });
  const target = dryRun
    ? null
    : new MongoClient(targetUrl, { serverSelectionTimeoutMS: 20000 });

  await source.connect();
  if (target) await target.connect();

  try {
    const srcDb = source.db(sourceId.db);
    const dstDb = target ? target.db(identity(targetUrl).db) : null;
    const listed = await srcDb.listCollections({}, { nameOnly: false }).toArray();
    const collections = listed
      .filter((info) => info.type !== "view" && !info.name.startsWith("system."))
      .sort((a, b) => a.name.localeCompare(b.name));

    if (collections.length === 0) {
      throw new Error("Sursa nu are colecții de copiat.");
    }

    const summary = [];
    for (const info of collections) {
      summary.push(await copyCollection(srcDb, dstDb, info));
    }

    const docs = summary.reduce((sum, row) => sum + row.total, 0);
    console.log(`Gata: ${summary.length} colecții, ${docs} documente.`);
  } finally {
    await source.close();
    if (target) await target.close();
  }
}

main().catch((error) => {
  console.error(safe(error));
  process.exit(1);
});
