"use client";

import { useSearchParams } from "next/navigation";
import { AuthBackground } from "../../../components/auth/AuthBackground";
import { ResetPasswordForm } from "../../../components/auth/ResetPasswordForm";

/** Renders the password reset confirmation page using the token query string. */
export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  return (
    <AuthBackground>
      <div className="w-full max-w-[430px] rounded-[2rem] border border-white/20 bg-white/12 p-6 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl sm:p-7">
        <div className="mb-6">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-cyan-100">LEnglish</p>
          <h1 className="mt-2 text-3xl font-extrabold leading-tight">Choose a new password</h1>
        </div>
        <ResetPasswordForm token={token} />
      </div>
    </AuthBackground>
  );
}
