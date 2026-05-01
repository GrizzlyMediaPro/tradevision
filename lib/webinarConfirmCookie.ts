export const WEBINAR_CONFIRM_COOKIE_NAME = "tv_webinar_confirm_gate";

/** Aliniat cu maxAge pe cookie (secunde) */
export const WEBINAR_CONFIRM_MAX_AGE_SEC = 30 * 60;

function resolveSecret(): string | null {
  const s = process.env.WEBINAR_CONFIRM_SECRET?.trim();
  if (s && s.length >= 32) return s;
  if (process.env.NODE_ENV !== "production") {
    return "dev-only-tv-webinar-confirm-secret-32chars";
  }
  return null;
}

function bytesToBase64url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]!);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlToBytes(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function timingSafeEqualUint8(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i]! ^ b[i]!;
  return diff === 0;
}

async function hmacSha256Raw(
  secret: string,
  message: string,
): Promise<Uint8Array> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return new Uint8Array(sig);
}

/**
 * Valoare pentru cookie httpOnly: payload base64url + semnătură HMAC-SHA256 (Web Crypto).
 */
export async function createWebinarConfirmToken(
  firstName: string,
): Promise<string> {
  const secret = resolveSecret();
  if (!secret) {
    throw new Error(
      "WEBINAR_CONFIRM_SECRET trebuie setat în producție (minim 32 caractere).",
    );
  }
  const exp = Date.now() + WEBINAR_CONFIRM_MAX_AGE_SEC * 1000;
  const body = JSON.stringify({ v: 1, exp, fn: firstName });
  const payload = bytesToBase64url(new TextEncoder().encode(body));
  const sig = await hmacSha256Raw(secret, payload);
  return `${payload}.${bytesToBase64url(sig)}`;
}

export async function verifyWebinarConfirmToken(
  cookieValue: string | undefined | null,
): Promise<{ firstName: string } | null> {
  if (!cookieValue) return null;
  const dot = cookieValue.indexOf(".");
  if (dot <= 0) return null;
  const payload = cookieValue.slice(0, dot);
  const sigStr = cookieValue.slice(dot + 1);
  if (!sigStr) return null;

  const secret = resolveSecret();
  if (!secret) return null;

  let expected: Uint8Array;
  let got: Uint8Array;
  try {
    expected = await hmacSha256Raw(secret, payload);
    got = base64urlToBytes(sigStr);
  } catch {
    return null;
  }
  if (expected.length !== got.length) return null;
  if (!timingSafeEqualUint8(expected, got)) return null;

  let parsed: { v?: number; exp?: number; fn?: string };
  try {
    const json = new TextDecoder().decode(base64urlToBytes(payload));
    parsed = JSON.parse(json) as { v?: number; exp?: number; fn?: string };
  } catch {
    return null;
  }
  if (
    parsed.v !== 1 ||
    typeof parsed.fn !== "string" ||
    typeof parsed.exp !== "number"
  ) {
    return null;
  }
  if (parsed.exp < Date.now()) return null;
  if (parsed.fn.length > 200) return null;

  return { firstName: parsed.fn };
}
