import type { SelectHTMLAttributes } from "react";

type LEnSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
};

/** Renders a labeled select field with consistent LEnglish styles. */
export function LEnSelect({ label, error, id, className = "", children, ...props }: LEnSelectProps) {
  const selectId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");
  const errorId = `${selectId}-error`;

  return (
    <label className="block text-sm font-bold text-slate-100" htmlFor={selectId}>
      <span>{label}</span>
      <select
        id={selectId}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? errorId : undefined}
        className={`mt-2 min-h-12 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-300/40 ${error ? "border-rose-300" : ""} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error ? (
        <span id={errorId} className="mt-2 block text-xs font-semibold text-rose-200">
          {error}
        </span>
      ) : null}
    </label>
  );
}
