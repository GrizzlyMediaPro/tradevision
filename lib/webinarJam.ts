/**
 * Variabile de mediu:
 * - WEBINARJAM_API_KEY (obligatoriu pentru înscriere la distanță)
 * - WEBINARJAM_WEBINAR_ID (ex. 2)
 * - WEBINARJAM_SCHEDULE_ID (opțional — dacă lipsește, se folosește primul program returnat de API)
 * - WEBINARJAM_DEFAULT_PHONE_COUNTRY (opțional, implicit 40 — prefix pentru numere fără +)
 *
 * @see https://support.webinarjam.com/support/solutions/articles/153000168626-register-a-user-to-a-webinar-webinarjam-api-
 */
const WEBINARJAM_REGISTER_URL = "https://api.webinarjam.com/webinarjam/register";
const WEBINARJAM_WEBINAR_URL = "https://api.webinarjam.com/webinarjam/webinar";

export function isWebinarJamConfigured(): boolean {
  return Boolean(
    process.env.WEBINARJAM_API_KEY?.trim() &&
      process.env.WEBINARJAM_WEBINAR_ID?.trim(),
  );
}

function getWebinarId(): number | null {
  const raw = process.env.WEBINARJAM_WEBINAR_ID?.trim();
  if (!raw) return null;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function getFixedScheduleId(): number | null {
  const raw = process.env.WEBINARJAM_SCHEDULE_ID?.trim();
  if (!raw) return null;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** Cod țară fără +, doar cifre (implicit 40 pentru RO). */
function defaultPhoneCountryDigits(): string {
  return process.env.WEBINARJAM_DEFAULT_PHONE_COUNTRY?.replace(/\D/g, "") || "40";
}

/**
 * WebinarJam cere `phone_country_code` cu "+" și `phone` doar cu cifre (fără prefix țară).
 * Presupunem în principal numere din RO; dacă utilizatorul introduce +cod, îl respectăm.
 */
export function splitPhoneForWebinarJam(phone: string): {
  phone_country_code: string;
  phone: string;
} {
  const trimmed = phone.trim();
  const digitsAll = trimmed.replace(/\D/g, "");
  const ccDigits = defaultPhoneCountryDigits();

  if (trimmed.startsWith("+")) {
    const d = trimmed.slice(1).replace(/\D/g, "");
    if (d.startsWith(ccDigits) && d.length > ccDigits.length) {
      return {
        phone_country_code: `+${ccDigits}`,
        phone: d.slice(ccDigits.length),
      };
    }
    if (d.startsWith("1") && d.length === 11) {
      return { phone_country_code: "+1", phone: d.slice(1) };
    }
    return {
      phone_country_code: `+${ccDigits}`,
      phone: d,
    };
  }


  if (digitsAll.startsWith(ccDigits) && digitsAll.length > ccDigits.length + 6) {
    return {
      phone_country_code: `+${ccDigits}`,
      phone: digitsAll.slice(ccDigits.length),
    };
  }

  if (digitsAll.startsWith("0") && digitsAll.length >= 9) {
    return {
      phone_country_code: `+${ccDigits}`,
      phone: digitsAll.replace(/^0+/, ""),
    };
  }

  return {
    phone_country_code: `+${ccDigits}`,
    phone: digitsAll.replace(/^0+/, "") || digitsAll,
  };
}

type WjWebinarResponse = {
  status?: string;
  webinar?: {
    schedules?: Array<{ schedule?: number; date?: string }>;
  };
  message?: string;
};

export async function resolveWebinarJamScheduleId(
  apiKey: string,
  webinarId: number,
): Promise<{ scheduleId: number } | { error: string }> {
  const fixed = getFixedScheduleId();
  if (fixed != null) {
    return { scheduleId: fixed };
  }

  const body = new URLSearchParams({
    api_key: apiKey,
    webinar_id: String(webinarId),
  });

  const res = await fetch(WEBINARJAM_WEBINAR_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  const data = (await res.json().catch(() => null)) as WjWebinarResponse | null;
  const schedules = data?.webinar?.schedules;

  if (data?.status !== "success" || !schedules?.length) {
    const hint =
      data?.message && typeof data.message === "string"
        ? ` (${data.message})`
        : "";
    return {
      error: `Nu am putut citi programul webinarului din WebinarJam.${hint} Setează WEBINARJAM_SCHEDULE_ID în variabile de mediu dacă problema persistă.`,
    };
  }

  const first = schedules[0]?.schedule;
  if (typeof first !== "number" || first <= 0) {
    return {
      error:
        "WebinarJam nu a returnat un ID de program valid. Setează WEBINARJAM_SCHEDULE_ID manual.",
    };
  }

  return { scheduleId: first };
}

type WjRegisterResponse = {
  status?: string;
  message?: string;
  user?: unknown;
};

function extractErrorMessage(data: WjRegisterResponse | null): string {
  if (data?.message && typeof data.message === "string") {
    return data.message;
  }
  return "Răspuns necunoscut de la WebinarJam.";
}

/** Mesaj prietenos dacă API returnează text în engleză cunoscut */
export function mapWebinarJamErrorToUserMessage(apiMessage: string): string {
  const lower = apiMessage.toLowerCase();
  if (
    lower.includes("already") ||
    lower.includes("duplicate") ||
    lower.includes("registered")
  ) {
    return "Acest email pare deja înscris la webinar în WebinarJam. Folosește altă adresă sau verifică inboxul.";
  }
  if (lower.includes("custom field") || lower.includes("custom_field")) {
    return "Înscrierea prin API necesită câmpuri suplimentare configurate în WebinarJam. Contactează suportul sau verifică articolul despre custom fields în documentația WebinarJam.";
  }
  return "WebinarJam a respins înscrierea. Te rugăm să încerci din nou sau să ne contactezi.";
}

export async function registerAttendeeWithWebinarJam(input: {
  firstName: string;
  email: string;
  phone: string;
  clientIp?: string;
}): Promise<
  | { ok: true }
  | { ok: false; userMessage: string; logDetail?: string; alreadyRegistered?: boolean }
> {
  const apiKey = process.env.WEBINARJAM_API_KEY?.trim();
  const webinarId = getWebinarId();
  if (!apiKey || webinarId == null) {
    return {
      ok: false,
      userMessage: "Integrarea WebinarJam nu este configurată corect pe server.",
    };
  }

  const scheduleRes = await resolveWebinarJamScheduleId(apiKey, webinarId);
  if ("error" in scheduleRes) {
    return { ok: false, userMessage: scheduleRes.error, logDetail: scheduleRes.error };
  }

  const { phone_country_code, phone: phoneDigits } = splitPhoneForWebinarJam(
    input.phone,
  );

  const body = new URLSearchParams({
    api_key: apiKey,
    webinar_id: String(webinarId),
    schedule: String(scheduleRes.scheduleId),
    first_name: input.firstName.trim(),
    email: input.email.trim().toLowerCase(),
    phone_country_code,
    phone: phoneDigits,
    twilio_consent: "true",
  });

  if (input.clientIp && /^[\d.:a-fA-F]+$/.test(input.clientIp)) {
    body.set("ip_address", input.clientIp);
  }

  const res = await fetch(WEBINARJAM_REGISTER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  const data = (await res.json().catch(() => null)) as WjRegisterResponse | null;

  if (!res.ok) {
    const detail = extractErrorMessage(data);
    return {
      ok: false,
      userMessage: mapWebinarJamErrorToUserMessage(detail),
      logDetail: `HTTP ${res.status}: ${detail}`,
    };
  }

  if (data?.status === "success") {
    return { ok: true };
  }

  const detail = extractErrorMessage(data);
  const already =
    /already|duplicate|registered/i.test(detail) ||
    /already|duplicate|registered/i.test(String(data?.message ?? ""));
  return {
    ok: false,
    userMessage: mapWebinarJamErrorToUserMessage(detail),
    logDetail: detail,
    alreadyRegistered: already,
  };
}
