import { Resend } from "resend";

const apiKey = process.env.RESEND || process.env.RESEND_API_KEY;

export const resend = apiKey ? new Resend(apiKey) : null;

/**
 * Adresa "From" pentru toate emailurile.
 * Pentru domeniu verificat în Resend (ex: trade-vision.ro), setează în .env:
 *   RESEND_FROM_EMAIL="Trade Vision <noreply@trade-vision.ro>"
 * Dacă nu e setat, se folosește adresa implicită Resend (doar pentru testare).
 */
export const resendFrom =
  process.env.RESEND_FROM_EMAIL?.trim() ||
  "Trade Vision <onboarding@resend.dev>";

