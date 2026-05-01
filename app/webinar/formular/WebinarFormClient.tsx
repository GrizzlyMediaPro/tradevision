"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";

type FormState = {
  firstName: string;
  email: string;
  phone: string;
  acceptedTerms: boolean;
};

const TOTAL_STEPS = 4;

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isValidPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 8;
}

export function WebinarFormClient() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>({
    firstName: "",
    email: "",
    phone: "",
    acceptedTerms: false,
  });
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const canContinue = useMemo(() => {
    if (step === 0) return form.firstName.trim().length >= 2;
    if (step === 1) return isValidEmail(form.email);
    if (step === 2) return isValidPhone(form.phone);
    if (step === 3) return form.acceptedTerms;
    return false;
  }, [step, form]);

  const handleNext = () => {
    if (!canContinue) return;
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    if (!canContinue || status === "loading") return;
    setStatus("loading");
    setSubmitError(null);
    try {
      const res = await fetch("/api/webinar/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          acceptedTerms: form.acceptedTerms,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!res.ok) {
        setSubmitError(data.error || "Eroare la trimitere. Încearcă din nou.");
        setStatus("error");
        return;
      }
      router.push("/webinar/confirmare");
    } catch {
      setSubmitError("Nu am putut trimite datele. Verifică conexiunea și încearcă din nou.");
      setStatus("error");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (step < TOTAL_STEPS - 1) {
        handleNext();
      } else {
        handleSubmit();
      }
    }
  };

  return (
    <main className="relative isolate flex min-h-screen w-full flex-col overflow-hidden bg-[#020312] text-white">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse at 50% 50%, black 20%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 50%, black 20%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 18%, rgba(168,85,247,0.16), transparent 45%), radial-gradient(circle at 88% 10%, rgba(251,191,36,0.10), transparent 40%)",
        }}
      />

      <header className="relative z-10 flex w-full items-center justify-between px-4 pt-6 sm:px-8 sm:pt-8">
        <Link
          href="/webinar"
          className="inline-flex items-center gap-2 text-xs font-medium text-white/60 transition hover:text-white"
        >
          <FaArrowLeft className="h-3 w-3" />
          Înapoi
        </Link>

        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Trade Vision"
            width={140}
            height={40}
            className="h-8 w-auto"
            priority
          />
        </Link>

        <div className="w-[60px]" />
      </header>

      <div className="relative z-10 mx-auto mt-6 w-full max-w-xl px-4 sm:px-6">
        <div className="flex items-center gap-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, idx) => {
            const completed = idx < step;
            const active = idx === step;
            return (
              <div
                key={idx}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  completed
                    ? "bg-linear-to-r from-yellow-400 via-amber-300 to-yellow-500"
                    : active
                    ? "bg-yellow-300/70"
                    : "bg-white/10"
                }`}
              />
            );
          })}
        </div>
        <p className="mt-2 text-right text-[11px] font-medium uppercase tracking-wider text-white/45">
          Pasul {Math.min(step + 1, TOTAL_STEPS)} din {TOTAL_STEPS}
        </p>
      </div>

      <section className="relative z-10 flex flex-1 items-center justify-center px-4 pb-16 pt-10 sm:px-6">
        <div className="w-full max-w-xl">
          {step === 0 && (
                <FormStep
                  number="1"
                  question="Prenumele tău este:"
                  required
                >
                  <TextInput
                    autoFocus
                    placeholder="Scrie răspunsul aici..."
                    value={form.firstName}
                    onChange={(value) =>
                      setForm((prev) => ({ ...prev, firstName: value }))
                    }
                    onKeyDown={handleKeyDown}
                  />
                </FormStep>
          )}

          {step === 1 && (
                <FormStep
                  number="2"
                  question="Care este adresa ta de email?"
                  required
                >
                  <TextInput
                    autoFocus
                    type="email"
                    inputMode="email"
                    placeholder="exemplu@email.com"
                    value={form.email}
                    onChange={(value) =>
                      setForm((prev) => ({ ...prev, email: value }))
                    }
                    onKeyDown={handleKeyDown}
                  />
                  {form.email.length > 0 && !isValidEmail(form.email) && (
                    <p className="mt-3 text-xs text-red-400">
                      Te rugăm să introduci o adresă de email validă.
                    </p>
                  )}
                </FormStep>
          )}

          {step === 2 && (
                <FormStep
                  number="3"
                  question="Care este numărul tău de telefon?"
                  required
                >
                  <TextInput
                    autoFocus
                    type="tel"
                    inputMode="tel"
                    placeholder="07XX XXX XXX"
                    value={form.phone}
                    onChange={(value) =>
                      setForm((prev) => ({ ...prev, phone: value }))
                    }
                    onKeyDown={handleKeyDown}
                  />
                </FormStep>
          )}

          {step === 3 && (
                <FormStep number="4" question="Aproape gata!" required>
                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/3 px-4 py-4 transition hover:border-white/20">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={form.acceptedTerms}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          acceptedTerms: e.target.checked,
                        }))
                      }
                    />
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-white/25 bg-white/5 transition peer-checked:border-yellow-300 peer-checked:bg-yellow-400/20">
                      {form.acceptedTerms && (
                        <svg
                          className="h-3 w-3 text-yellow-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </span>
                    <span className="text-xs leading-relaxed text-white/70 sm:text-sm">
                      Te rugăm să accepți{" "}
                      <Link
                        href="/termeni-conditii"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-white underline decoration-white/40 underline-offset-2 transition hover:text-yellow-300 hover:decoration-yellow-300"
                      >
                        termenii și condițiile
                      </Link>
                      ,{" "}
                      <Link
                        href="/politica-confidentialitate"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-white underline decoration-white/40 underline-offset-2 transition hover:text-yellow-300 hover:decoration-yellow-300"
                      >
                        politica de confidențialitate
                      </Link>{" "}
                      și transmiterea de mesaje de marketing cu privire la
                      serviciile și produsele noastre afișate pe site.
                      <span className="text-yellow-300">*</span>
                    </span>
                  </label>
                </FormStep>
          )}

          {status === "error" && (
                <p className="mt-4 text-center text-xs text-red-400">
                  {submitError ||
                    "A apărut o eroare. Te rugăm să încerci din nou."}
                </p>
          )}

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={step === 0}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-xs font-medium text-white/65 transition hover:border-white/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <FaArrowLeft className="h-3 w-3" />
                  Înapoi
                </button>

                {step < TOTAL_STEPS - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!canContinue}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-yellow-400 via-amber-300 to-yellow-500 px-7 py-3.5 text-sm font-bold text-slate-900 shadow-[0_14px_30px_rgba(250,204,21,0.35)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >
                    Mai departe
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!canContinue || status === "loading"}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-yellow-400 via-amber-300 to-yellow-500 px-7 py-3.5 text-sm font-bold text-slate-900 shadow-[0_14px_30px_rgba(250,204,21,0.35)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >
                    {status === "loading"
                      ? "Se trimite..."
                      : "Trimite înscrierea"}
                  </button>
                )}
          </div>
        </div>
      </section>
    </main>
  );
}

type FormStepProps = {
  number: string;
  question: string;
  required?: boolean;
  children: React.ReactNode;
};

function FormStep({ number, question, required, children }: FormStepProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-baseline gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-yellow-300/80">
          {number}
        </span>
        <h2 className="text-xl font-semibold text-white sm:text-2xl md:text-3xl">
          {question}
          {required && <span className="ml-1 text-yellow-300">*</span>}
        </h2>
      </div>

      <div>{children}</div>
    </div>
  );
}

type TextInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoFocus?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
  autoFocus,
  onKeyDown,
}: TextInputProps) {
  return (
    <input
      autoFocus={autoFocus}
      type={type}
      inputMode={inputMode}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      className="w-full border-b-2 border-white/15 bg-transparent pb-3 text-lg font-medium text-white placeholder-white/30 outline-none transition focus:border-yellow-300 sm:text-xl md:text-2xl"
    />
  );
}
