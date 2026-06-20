"use client";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-yellow-300/50";

type BillingFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  type?: string;
  className?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
};

export function BillingField({
  label,
  name,
  value,
  onChange,
  autoComplete,
  type = "text",
  className = "",
  inputMode,
}: BillingFieldProps) {
  const id = `billing-${name}`;

  return (
    <label htmlFor={id} className={`flex flex-col gap-2 ${className}`}>
      <span className="text-xs font-medium uppercase tracking-wider text-white/50">
        {label}
      </span>
      <input
        id={id}
        name={name}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onInput={(e) => onChange(e.currentTarget.value)}
        className={`billing-autofill-input ${inputClass}`}
      />
    </label>
  );
}
