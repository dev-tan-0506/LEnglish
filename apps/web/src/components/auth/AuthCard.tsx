"use client";

import { useState } from "react";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";

type AuthMode = "login" | "signup" | "forgot";

type AuthCardProps = {
  initialMode?: AuthMode;
};

/** Renders the glass auth card and flips between login and signup. */
export function AuthCard({ initialMode = "login" }: AuthCardProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const isSignup = mode === "signup";
  const isForgot = mode === "forgot";

  return (
    <div className="w-full max-w-[430px] [perspective:1200px]">
      <div
        className={`rounded-[2rem] border border-white/20 bg-white/12 p-6 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl transition duration-500 [transform-style:preserve-3d] sm:p-7 ${
          isSignup ? "[transform:rotateY(4deg)]" : "[transform:rotateY(0deg)]"
        }`}
      >
        <div className="mb-6">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-cyan-100">LEnglish</p>
          <h1 className="mt-2 text-3xl font-extrabold leading-tight">
            {isForgot ? "Reset password" : isSignup ? "Create account" : "Welcome back"}
          </h1>
        </div>

        {isForgot ? (
          <ForgotPasswordForm onLogin={() => setMode("login")} />
        ) : isSignup ? (
          <SignupForm onLogin={() => setMode("login")} />
        ) : (
          <LoginForm onForgot={() => setMode("forgot")} onSignup={() => setMode("signup")} />
        )}
      </div>
    </div>
  );
}
