import sanitizeHtml from "sanitize-html";
import { convert } from "html-to-text";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/locale";
import { messages } from "@/lib/i18n/messages/catalog";
import { translate, type Vars } from "@/lib/i18n/translate";

type HtmlAttribs = sanitizeHtml.Attributes;

const BRAND = {
  siteName: "TradeVision România",
  siteUrl: "https://trade-vision.ro",
  primaryColor: "#783dff",
  accentColor: "#ff8c42",
  backgroundColor: "transparent",
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
    .map((p) => `<p style="margin: 0 0 12px; line-height: 1.6; font-size: 14px; color: #000000;">${p}</p>`)
    .join("");
}

const ALLOWED_NEWSLETTER_IMAGE_HOSTS = [
  "utfs.io",
  "ufs.sh",
  "uploadthing.com",
];

function isAllowedNewsletterImageSrc(src: string): boolean {
  try {
    const parsed = new URL(src);
    if (parsed.protocol !== "https:") return false;
    return ALLOWED_NEWSLETTER_IMAGE_HOSTS.some(
      (host) => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`),
    );
  } catch {
    return false;
  }
}

export function sanitizeNewsletterHtml(inputHtml: string): string {
  const sanitized = sanitizeHtml(inputHtml || "", {
    allowedTags: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "s",
      "ul",
      "ol",
      "li",
      "blockquote",
      "h2",
      "h3",
      "a",
      "img",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height", "style"],
      p: ["style"],
      h2: ["style"],
      h3: ["style"],
    },
    allowedStyles: {
      p: {
        "text-align": [/^(left|center|right|justify)$/],
        "font-size": [/^(12|14|16|18|20|24)px$/],
      },
      h2: {
        "text-align": [/^(left|center|right|justify)$/],
        "font-size": [/^(12|14|16|18|20|24)px$/],
      },
      h3: {
        "text-align": [/^(left|center|right|justify)$/],
        "font-size": [/^(12|14|16|18|20|24)px$/],
      },
      img: {
        "max-width": [/^\d+%$/],
        width: [/^\d+(px)?$/],
        height: [/^(auto|\d+(px)?)$/],
        display: [/^(block|inline-block)$/],
      },
    },
    allowedSchemes: ["https", "mailto"],
    allowedSchemesByTag: {
      img: ["https"],
    },
    transformTags: {
      a: (tagName: string, attribs: HtmlAttribs) => ({
        tagName,
        attribs: {
          ...attribs,
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      img: (tagName: string, attribs: HtmlAttribs) => {
        const src = attribs.src ?? "";
        if (!isAllowedNewsletterImageSrc(src)) {
          return { tagName: "span", attribs: { style: "display:none;" }, text: "" };
        }
        const cleanImgAttribs: HtmlAttribs = {
          src,
          alt: attribs.alt || "Newsletter image",
          ...(attribs.width ? { width: attribs.width } : {}),
          ...(attribs.height ? { height: attribs.height } : {}),
          style: "max-width:100%;height:auto;display:block;",
        };
        return {
          tagName,
          attribs: cleanImgAttribs,
        };
      },
    },
  }).trim();

  return sanitized || "<p> </p>";
}

export function renderPlainTextFromHtml(inputHtml: string): string {
  return renderPlainTextBody(
    convert(inputHtml || "", {
      wordwrap: false,
      selectors: [{ selector: "a", options: { hideLinkHrefIfSameAsText: true } }],
    }),
  );
}

export function renderEmailLayout(options: {
  title: string;
  previewText?: string;
  contentHtml: string;
  recipientEmail?: string;
  unsubscribeToken?: string;
  locale?: Locale;
}): string {
  const { title, previewText, contentHtml, recipientEmail, unsubscribeToken } = options;
  const locale = options.locale ?? DEFAULT_LOCALE;
  const t = (id: string, vars?: Vars) => translate(messages[locale], id, vars);

  const preview = previewText
    ? escapeHtml(previewText)
    : `${BRAND.siteName} - ${title}`;
  const emailHost = BRAND.siteUrl.replace(/^https?:\/\//, "");

  return `<!DOCTYPE html>
<html lang="${locale}">
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
      a,
      a:visited,
      a:hover,
      a:active {
        color: inherit;
        text-decoration: none;
        outline: none;
        border: 0;
      }
      img {
        border: 0;
        outline: none;
        text-decoration: none;
        -ms-interpolation-mode: bicubic;
      }
      .email-content img {
        display: block;
        max-width: 100% !important;
        width: auto !important;
        height: auto !important;
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background-color:${BRAND.backgroundColor};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
      ${preview}
    </div>
    <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style="background-color:${BRAND.backgroundColor};padding:0;">
      <tr>
        <td align="left">
          <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style="background-color:transparent;border:0;border-radius:0;box-shadow:none;">
            <tr>
              <td style="padding:20px 28px 16px;background:radial-gradient(circle at 10% 20%, rgba(120,61,255,0.22) 0, transparent 55%),radial-gradient(circle at 80% 0%, rgba(255,140,66,0.26) 0, transparent 55%),#020617;border-bottom:1px solid rgba(148,163,184,0.3);">
                <a href="${BRAND.siteUrl}" style="text-decoration:none;display:inline-flex;align-items:center;gap:12px;outline:none;border:0;">
                  <img
                    src="${EMAIL_LOGO_URL}"
                    width="120"
                    height="40"
                    alt="${BRAND.siteName}"
                    style="display:block;height:40px;width:auto;max-width:160px;object-fit:contain;border:0;outline:none;text-decoration:none;"
                  />
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 12px 16px;background:transparent;">
                <h1 style="margin:0 0 16px;font-size:20px;line-height:1.3;font-weight:700 !important;color:#000000;letter-spacing:0.02em;">
                  ${escapeHtml(title)}
                </h1>
                <div style="height:2px;width:64px;border-radius:999px;background-image:linear-gradient(to right,${BRAND.accentColor},#fde68a,${BRAND.primaryColor});margin-bottom:18px;"></div>
                <div class="email-content" style="font-size:14px;line-height:1.7;color:#000000;">
                  ${contentHtml}
                </div>
                <p style="margin:20px 0 10px;font-size:14px;line-height:1.6;color:#000000;">
                  ${t("email.respect")}
                </p>
                <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style="margin-top:14px;border:1px solid rgba(148,163,184,0.25);background-color:#ffffff;">
                  <tr>
                    <td style="padding:10px 12px;width:108px;vertical-align:middle;border-right:1px solid rgba(148,163,184,0.25);">
                      <img
                        src="${EMAIL_LOGO_URL}"
                        alt="${BRAND.siteName}"
                        width="96"
                        height="96"
                        style="display:block;width:96px;height:96px;object-fit:contain;border:0;outline:none;text-decoration:none;"
                      />
                    </td>
                    <td style="padding:10px 12px;vertical-align:middle;">
                      <p style="margin:0 0 4px;font-size:17px;line-height:1.2;font-weight:700;color:#111827;letter-spacing:0.08em;">
                        TRADEVISION
                      </p>
                      <p style="margin:0 0 8px;font-size:12px;line-height:1.4;font-style:italic;color:#374151;">
                        ${t("email.team")}
                      </p>
                      <p style="margin:0 0 4px;font-size:12px;line-height:1.5;color:#111827;white-space:nowrap;">
                        ✉️ <a href="mailto:contact@trade-vision.ro" style="color:#111827;text-decoration:none;white-space:nowrap;">contact@trade-vision.ro</a>
                      </p>
                      <p style="margin:0;font-size:12px;line-height:1.5;color:#111827;">
                        🌐 ${emailHost}
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 12px 18px;background:transparent;border-top:1px solid rgba(148,163,184,0.2);">
                <p style="margin:0 0 6px;font-size:11px;line-height:1.5;color:#d1d5db;">
                  ${t("email.sentBy")}<strong style="color:#f3f4f6;">${BRAND.siteName}</strong>.
                </p>
                <p style="margin:0 0 6px;font-size:11px;line-height:1.5;color:#d1d5db;">
                  ${t("email.details")}
                  <a href="${BRAND.siteUrl}" style="color:#c4b5fd;text-decoration:none;font-weight:500;">
                    ${BRAND.siteUrl.replace(/^https?:\/\//, "")}
                  </a>.
                </p>
                <p style="margin:4px 0 0;font-size:10px;line-height:1.5;color:#9ca3af;">
                  ${t("email.noReply")}
                </p>
                ${recipientEmail && unsubscribeToken ? `<p style="margin:8px 0 0;font-size:10px;line-height:1.5;color:#9ca3af;">
                  ${t("email.unsubscribe")}<a href="${BRAND.siteUrl}/dezabonare?email=${encodeURIComponent(recipientEmail)}&token=${unsubscribeToken}" style="color:#c4b5fd;text-decoration:underline;">${t("email.unsubscribeLink")}</a>${t("email.unsubscribeAfter")}
                </p>` : ""}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

