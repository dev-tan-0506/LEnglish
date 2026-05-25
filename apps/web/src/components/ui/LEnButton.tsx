import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

const variants = {
  primary:
    "bg-cyan-300 text-slate-950 shadow-[0_5px_0_rgb(8_145_178)] hover:bg-cyan-200 active:translate-y-1 active:shadow-[0_2px_0_rgb(8_145_178)]",
  secondary:
    "border border-white/25 bg-white/12 text-white hover:bg-white/18 active:translate-y-1",
  ghost: "text-cyan-100 hover:bg-white/10 active:translate-y-1"
};

/** Renders the shared press-down button treatment for auth screens. */
export function LEnButton({ className = "", variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={`min-h-11 rounded-full px-5 py-3 text-sm font-extrabold transition focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
