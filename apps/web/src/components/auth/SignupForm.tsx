"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { register } from "../../lib/api/auth";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { authDestination, isStrongPassword, passwordPolicyText } from "./auth.forms";

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
      setError("Name, email, and password are required.");
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
      setError("This email may already be in use.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input label="Name" name="name" value={name} onChange={(event) => setName(event.target.value)} />
      <Input label="Email" name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      <Input label="Password" name="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      {error ? <p className="text-sm font-semibold text-rose-200">{error}</p> : null}
      <Button className="w-full" disabled={loading} type="submit">
        {loading ? "Creating..." : "Create account"}
      </Button>
      <button type="button" onClick={onLogin} className="w-full rounded-full px-2 py-1 text-sm font-bold text-cyan-100 hover:bg-white/10">
        Back to sign in
      </button>
    </form>
  );
}
