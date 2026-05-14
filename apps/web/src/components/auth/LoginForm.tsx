"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { login } from "../../lib/api/auth";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { authDestination } from "./auth.forms";

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
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      const user = await login({ email, password });
      router.push(authDestination(user));
    } catch {
      setError("Email or password is incorrect.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input label="Email" name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      <Input label="Password" name="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      {error ? <p className="text-sm font-semibold text-rose-200">{error}</p> : null}
      <Button className="w-full" disabled={loading} type="submit">
        {loading ? "Signing in..." : "Sign in"}
      </Button>
      <div className="flex items-center justify-between gap-3 text-sm font-bold text-cyan-100">
        <button type="button" onClick={onForgot} className="rounded-full px-2 py-1 hover:bg-white/10">
          Forgot password
        </button>
        <button type="button" onClick={onSignup} className="rounded-full px-2 py-1 hover:bg-white/10">
          Create account
        </button>
      </div>
    </form>
  );
}
