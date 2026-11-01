"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
export default function Login() {
  const router = useRouter(); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast.error("Enter a valid email address.");
    if (!password) return toast.error("Enter your password.");
    setBusy(true);
    const { error } = await authClient.signIn.email({ email, password });
    setBusy(false);
    if (error) return toast.error(error.message || "Email or password is wrong.");
    toast.success("Welcome back!"); router.push("/");
  };
  return (
    <div className="max-w-md mx-auto px-4 py-12"><h1 className="sec-title">Log in</h1>
      <form onSubmit={submit} className="grid gap-3">
        <input className="input w-full" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="input w-full" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn btn-primary" disabled={busy}>{busy ? <span className="loading loading-spinner" /> : "Log in"}</button>
      </form>
      <button className="btn btn-outline w-full mt-3" onClick={() => authClient.signIn.social({ provider: "github", callbackURL: "/" })}>Continue with GitHub</button>
      <p className="mt-4 text-sm">New here? <Link href="/register" className="link link-primary">Create an account</Link></p>
    </div>
  );
}
