"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { confirmPasswordReset } from "../../lib/api/auth";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { isStrongPassword, passwordPolicyText } from "./auth.forms";

type ResetPasswordFormProps = {
  token: string | null;
};

/** Handles reset token confirmation and new password validation. */
export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(token ? "" : "Reset token is missing.");
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
      setError("Passwords must match.");
      return;
    }

    setLoading(true);
    try {
      await confirmPasswordReset({ token, password });
      router.push("/login");
    } catch {
      setError("This reset link is invalid or expired.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input label="New password" name="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      <Input label="Confirm password" name="confirm-password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
      {error ? <p className="text-sm font-semibold text-rose-200">{error}</p> : null}
      <Button className="w-full" disabled={loading || !token} type="submit">
        {loading ? "Resetting..." : "Reset password"}
      </Button>
    </form>
  );
}
