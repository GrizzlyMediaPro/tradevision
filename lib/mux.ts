import Mux from "@mux/mux-node";

let muxClient: Mux | null = null;

export function isMuxConfigured(): boolean {
  return Boolean(
    process.env.MUX_TOKEN_ID?.trim() && process.env.MUX_TOKEN_SECRET?.trim(),
  );
}

function getSigningKeyId(): string | undefined {
  return (
    process.env.MUX_SIGNING_KEY?.trim() ||
    process.env.MUX_SIGNING_KEY_ID?.trim() ||
    undefined
  );
}

function getSigningPrivateKey(): string | undefined {
  return (
    process.env.MUX_PRIVATE_KEY?.trim() ||
    process.env.MUX_SIGNING_PRIVATE_KEY?.trim() ||
    undefined
  );
}

export function isMuxSigningConfigured(): boolean {
  return Boolean(getSigningKeyId() && getSigningPrivateKey());
}

export function getMuxClient(): Mux {
  if (!isMuxConfigured()) {
    throw new Error(
      "Mux nu este configurat. Setează MUX_TOKEN_ID și MUX_TOKEN_SECRET.",
    );
  }
  if (!muxClient) {
    muxClient = new Mux({
      tokenId: process.env.MUX_TOKEN_ID!,
      tokenSecret: process.env.MUX_TOKEN_SECRET!,
      jwtSigningKey: getSigningKeyId(),
      jwtPrivateKey: getSigningPrivateKey(),
      webhookSecret: process.env.MUX_WEBHOOK_SECRET?.trim(),
    });
  }
  return muxClient;
}

export async function createDirectUpload(corsOrigin: string) {
  const mux = getMuxClient();
  return mux.video.uploads.create({
    cors_origin: corsOrigin,
    new_asset_settings: {
      playback_policy: ["signed"],
    },
  });
}

export async function signPlaybackTokens(playbackId: string) {
  if (!isMuxSigningConfigured()) {
    throw new Error(
      "Mux signing keys lipsesc. Setează MUX_SIGNING_KEY și MUX_PRIVATE_KEY.",
    );
  }

  const mux = getMuxClient();
  const expiration = "6h";
  const keyId = getSigningKeyId()!;
  const keySecret = getSigningPrivateKey()!;

  const [playback, thumbnail] = await Promise.all([
    mux.jwt.signPlaybackId(playbackId, {
      keyId,
      keySecret,
      expiration,
      type: "video",
    }),
    mux.jwt.signPlaybackId(playbackId, {
      keyId,
      keySecret,
      expiration,
      type: "thumbnail",
    }),
  ]);

  return { playback, thumbnail };
}

export async function retrieveUpload(uploadId: string) {
  const mux = getMuxClient();
  return mux.video.uploads.retrieve(uploadId);
}

export async function retrieveAsset(assetId: string) {
  const mux = getMuxClient();
  return mux.video.assets.retrieve(assetId);
}
