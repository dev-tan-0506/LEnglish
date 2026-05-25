"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { login } from "../../services/auth";
import { LEnButton } from "../ui/LEnButton";
import { LEnInput } from "../ui/LEnInput";
import { authDestination } from "./auth.forms";
import { AUTH_ERROR_MESSAGES } from "../../messages/auth.messages";

type LoginFormProps = {
  onSignup: () => void;
  onForgot: () => void;
};

/** Handles credential login and post-auth routing. */
export function LoginForm({ onSignup, onForgot }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /** Submits the login form to the backend auth endpoint. */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError(AUTH_ERROR_MESSAGES.LOGIN_REQUIRED_FIELDS);
      return;
    }

    setLoading(true);
    try {
      const user = await login({ email, password });
      router.push(authDestination(user));
    } catch {
      setError(AUTH_ERROR_MESSAGES.LOGIN_INVALID_CREDENTIALS);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <LEnInput label="Email" name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      <LEnInput label="Password" name="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      {error ? <p className="text-sm font-semibold text-rose-200">{error}</p> : null}
      <LEnButton className="w-full" disabled={loading} type="submit">
        {loading ? "Signing in..." : "Sign in"}
      </LEnButton>
      <div className="flex items-center justify-between gap-3 text-sm font-bold text-cyan-100">
        <LEnButton type="button" onClick={onForgot} className="rounded-full px-2 py-1 hover:bg-white/10">
          Forgot password
        </LEnButton>
        <LEnButton type="button" onClick={onSignup} className="rounded-full px-2 py-1 hover:bg-white/10">
          Create account
        </LEnButton>
      </div>
    </form>
  );
}



