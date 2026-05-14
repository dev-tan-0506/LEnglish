import type { ReactNode } from "react";

type AuthBackgroundProps = {
  children: ReactNode;
};

/** Provides the animated full-screen background for auth routes. */
export function AuthBackground({ children }: AuthBackgroundProps) {
  return (
    <main className="relative grid min-h-screen overflow-hidden bg-slate-950 px-5 py-7 text-white sm:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_20%,rgb(34_211_238_/_22%),transparent_20rem),radial-gradient(circle_at_84%_10%,rgb(244_114_182_/_18%),transparent_22rem),linear-gradient(135deg,rgb(2_6_23),rgb(15_23_42)_44%,rgb(7_89_133))]" />
      <div className="pointer-events-none absolute -left-10 top-20 h-52 w-52 rounded-[42%] border border-cyan-200/25 bg-cyan-200/10 blur-[1px] animate-[auth-float_8s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute bottom-8 right-6 h-36 w-36 rounded-[38%] border border-rose-200/25 bg-rose-200/10 animate-[auth-float_9s_ease-in-out_infinite_reverse]" />
      <section className="relative z-10 flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        {children}
      </section>
    </main>
  );
}
