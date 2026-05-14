import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

/** Renders a labeled pill input with accessible error text. */
export function Input({ label, error, id, className = "", ...props }: InputProps) {
  const inputId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");
  const errorId = `${inputId}-error`;

  return (
    <label className="block text-sm font-bold text-slate-100" htmlFor={inputId}>
      <span>{label}</span>
      <input
        id={inputId}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? errorId : undefined}
        className={`mt-2 min-h-12 w-full rounded-full border border-white/20 bg-white/12 px-4 text-base text-white outline-none transition placeholder:text-slate-300 focus:border-cyan-200 focus:ring-2 focus:ring-cyan-200/40 ${error ? "animate-[auth-shake_180ms_ease-in-out_2] border-rose-300" : ""} ${className}`}
        {...props}
      />
      {error ? (
        <span id={errorId} className="mt-2 block text-xs font-semibold text-rose-200">
          {error}
        </span>
      ) : null}
    </label>
  );
}
