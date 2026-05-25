"use client";

import { useState, type FormEvent } from "react";
import { requestPasswordReset } from "../../services/auth";
import { LEnButton } from "../ui/LEnButton";
import { LEnInput } from "../ui/LEnInput";
import { AUTH_SUCCESS_MESSAGES } from "../../messages/auth.messages";

type ForgotPasswordFormProps = {
  onLogin: () => void;
};

/** Handles password reset email requests with generic messaging. */
export function ForgotPasswordForm({ onLogin }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  /** Submits a reset request without revealing account existence. */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await requestPasswordReset({ email });
      setMessage(AUTH_SUCCESS_MESSAGES.RESET_EMAIL_SENT);
    } catch {
      setMessage(AUTH_SUCCESS_MESSAGES.RESET_EMAIL_SENT);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <LEnInput label="Email" name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      {message ? <p className="text-sm font-semibold text-cyan-100">{message}</p> : null}
      <LEnButton className="w-full" disabled={loading || !email} type="submit">
        {loading ? "Sending..." : "Send reset link"}
      </LEnButton>
      <LEnButton type="button" onClick={onLogin} className="w-full rounded-full px-2 py-1 text-sm font-bold text-cyan-100 hover:bg-white/10">
        Back to sign in
      </LEnButton>
    </form>
  );
}



