"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { register } from "../../services/auth";
import { LEnButton } from "../ui/LEnButton";
import { LEnInput } from "../ui/LEnInput";
import { authDestination, isStrongPassword, passwordPolicyText } from "./auth.forms";
import { AUTH_ERROR_MESSAGES } from "../../messages/auth.messages";

type SignupFormProps = {
  onLogin: () => void;
};

/** Handles account registration and onboarding routing. */
export function SignupForm({ onLogin }: SignupFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /** Submits the signup form to the backend registration endpoint. */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email || !name || !password) {
      setError(AUTH_ERROR_MESSAGES.SIGNUP_REQUIRED_FIELDS);
      return;
    }

    if (!isStrongPassword(password)) {
      setError(passwordPolicyText);
      return;
    }

    setLoading(true);
    try {
      const user = await register({ email, password, name });
      router.push(authDestination(user));
    } catch {
      setError(AUTH_ERROR_MESSAGES.SIGNUP_EMAIL_IN_USE);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <LEnInput label="Name" name="name" value={name} onChange={(event) => setName(event.target.value)} />
      <LEnInput label="Email" name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      <LEnInput label="Password" name="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      {error ? <p className="text-sm font-semibold text-rose-200">{error}</p> : null}
      <LEnButton className="w-full" disabled={loading} type="submit">
        {loading ? "Creating..." : "Create account"}
      </LEnButton>
      <LEnButton type="button" onClick={onLogin} className="w-full rounded-full px-2 py-1 text-sm font-bold text-cyan-100 hover:bg-white/10">
        Back to sign in
      </LEnButton>
    </form>
  );
}




