import { createHmac } from "crypto";

const SECRET = process.env.UNSUBSCRIBE_SECRET || process.env.RESEND_API_KEY || "tradevision-unsub-fallback";

export function generateUnsubscribeToken(email: string): string {
  return createHmac("sha256", SECRET)
    .update(email.trim().toLowerCase())
    .digest("hex")
    .slice(0, 32);
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  return generateUnsubscribeToken(email) === token;
}
