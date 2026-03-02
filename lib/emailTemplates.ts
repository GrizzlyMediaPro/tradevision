const BRAND = {
  siteName: "TradeVision România",
  siteUrl: "https://trade-vision.ro",
  primaryColor: "#783dff",
  accentColor: "#ff8c42",
  backgroundColor: "#020312",
};

const EMAIL_LOGO_URL =
  process.env.EMAIL_LOGO_URL || `${BRAND.siteUrl}/logo.png`;

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function renderPlainTextBody(body: string): string {
  return body.trim() || " ";
}

export function renderPlainTextFromLines(lines: (string | false | null | undefined)[]): string {
  return renderPlainTextBody(
    lines
      .filter(Boolean)
      .map((l) => l!.toString())
      .join("\n"),
  );
}

export function renderSimpleBodyAsHtml(plainText: string): string {
  const safe = escapeHtml(plainText);
  const paragraphs = safe.split(/\n{2,}/).map((paragraph) =>
    paragraph
      .split(/\n/)
      .map((line) => line || "<br />")
      .join("<br />"),
  );

  return paragraphs
    .map((p) => `<p style="margin: 0 0 12px; line-height: 1.6; font-size: 14px; color: #111827;">${p}</p>`)
    .join("");
}

export function renderEmailLayout(options: {
  title: string;
  previewText?: string;
  contentHtml: string;
}): string {
  const { title, previewText, contentHtml } = options;

  const preview = previewText
    ? escapeHtml(previewText)
    : `${BRAND.siteName} - ${title}`;

  return `<!DOCTYPE html>
<html lang="ro">
  <head>
    <meta charSet="utf-8" />
    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <style>
      @media (prefers-color-scheme: dark) {
        body {
          background-color: ${BRAND.backgroundColor} !important;
        }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background-color:${BRAND.backgroundColor};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
      ${preview}
    </div>
    <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style="background-color:${BRAND.backgroundColor};padding:24px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style="max-width:640px;background-color:#020617;border-radius:24px;border:1px solid rgba(148,163,184,0.25);overflow:hidden;box-shadow:0 20px 45px rgba(0,0,0,0.7);">
            <tr>
              <td style="padding:20px 28px 16px;background:radial-gradient(circle at 10% 20%, rgba(120,61,255,0.22) 0, transparent 55%),radial-gradient(circle at 80% 0%, rgba(255,140,66,0.26) 0, transparent 55%),#020617;border-bottom:1px solid rgba(148,163,184,0.3);">
                <a href="${BRAND.siteUrl}" style="text-decoration:none;display:inline-flex;align-items:center;gap:12px;">
                  <img
                    src="${EMAIL_LOGO_URL}"
                    width="120"
                    height="40"
                    alt="${BRAND.siteName}"
                    style="display:block;height:40px;width:auto;max-width:160px;object-fit:contain;"
                  />
                  <span style="display:inline-block;">
                    <span style="display:block;font-size:11px;color:#9ca3af;">
                      Comparații prop firms & oferte
                    </span>
                  </span>
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px 20px;background:radial-gradient(circle at 10% 0%, rgba(120,61,255,0.14) 0, transparent 50%),radial-gradient(circle at 90% 0%, rgba(56,189,248,0.08) 0, transparent 60%),#020617;">
                <h1 style="margin:0 0 16px;font-size:20px;line-height:1.3;font-weight:600;color:#f9fafb;letter-spacing:0.02em;">
                  ${escapeHtml(title)}
                </h1>
                <div style="height:2px;width:64px;border-radius:999px;background-image:linear-gradient(to right,${BRAND.accentColor},#fde68a,${BRAND.primaryColor});margin-bottom:18px;"></div>
                <div style="font-size:14px;line-height:1.7;color:#e5e7eb;">
                  ${contentHtml}
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 28px 20px;background:#020617;border-top:1px solid rgba(15,23,42,0.9);">
                <p style="margin:0 0 6px;font-size:11px;line-height:1.5;color:#6b7280;">
                  Acest email ți-a fost trimis de <strong style="color:#e5e7eb;">${BRAND.siteName}</strong>.
                </p>
                <p style="margin:0 0 6px;font-size:11px;line-height:1.5;color:#4b5563;">
                  Pentru mai multe detalii, vizitează
                  <a href="${BRAND.siteUrl}" style="color:${BRAND.primaryColor};text-decoration:none;font-weight:500;">
                    ${BRAND.siteUrl.replace(/^https?:\/\//, "")}
                  </a>.
                </p>
                <p style="margin:4px 0 0;font-size:10px;line-height:1.5;color:#4b5563;">
                  Te rugăm să nu răspunzi direct la acest mesaj dacă nu este specificat altfel în conținut.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

