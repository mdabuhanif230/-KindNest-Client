"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import Btn from "@/components/Btn";
export default function Login() {
  const router = useRouter(); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [busy, setBusy] = useState(false);
  const [google, setGoogle] = useState(false);
  useEffect(() => { fetch("/api/config").then((r) => r.json()).then((d) => setGoogle(!!d.google)).catch(() => {}); }, []);
  const withGoogle = async () => {
    const { error } = await authClient.signIn.social({ provider: "google", callbackURL: "/" });
    if (error) toast.error(error.message || "Google sign-in failed.");
  };
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
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="paper tape p-7">
        <span className="sticker rounded-xl w-12 h-12 text-2xl -rotate-6 mb-4">🪺</span>
        <h1 className="sec-title">Log in</h1>
        <p className="hand text-lg opacity-70 mt-0.5 mb-5">Welcome back, neighbour!</p>
        <form onSubmit={submit} className="grid gap-3">
          <input className="input w-full" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" className="input w-full" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Btn disabled={busy}>{busy ? <span className="loading loading-spinner" /> : "Log in"}</Btn>
        </form>
        {google && <Btn variant="dark" className="w-full mt-3" onClick={withGoogle}>Continue with Google</Btn>}
      </div>
      <p className="mt-4 text-sm text-center">New here? <Link href="/register" className="link link-primary">Create an account</Link></p>
    </div>
  );
}
