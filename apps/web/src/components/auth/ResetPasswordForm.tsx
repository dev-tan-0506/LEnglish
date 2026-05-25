"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { confirmPasswordReset } from "../../services/auth";
import { LEnButton } from "../ui/LEnButton";
import { LEnInput } from "../ui/LEnInput";
import { isStrongPassword, passwordPolicyText } from "./auth.forms";
import { AUTH_ERROR_MESSAGES } from "../../messages/auth.messages";

type ResetPasswordFormProps = {
  token: string | null;
};

/** Handles reset token confirmation and new password validation. */
export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(token ? "" : AUTH_ERROR_MESSAGES.RESET_TOKEN_MISSING);
  const [loading, setLoading] = useState(false);

  /** Submits a valid reset token and matching new password. */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;

    setError("");
    if (!isStrongPassword(password)) {
      setError(passwordPolicyText);
      return;
    }

    if (password !== confirmPassword) {
      setError(AUTH_ERROR_MESSAGES.RESET_PASSWORD_MISMATCH);
      return;
    }

    setLoading(true);
    try {
      await confirmPasswordReset({ token, password });
      router.push("/login");
    } catch {
      setError(AUTH_ERROR_MESSAGES.RESET_LINK_INVALID);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <LEnInput label="New password" name="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      <LEnInput label="Confirm password" name="confirm-password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
      {error ? <p className="text-sm font-semibold text-rose-200">{error}</p> : null}
      <LEnButton className="w-full" disabled={loading || !token} type="submit">
        {loading ? "Resetting..." : "Reset password"}
      </LEnButton>
    </form>
  );
}




