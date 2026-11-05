"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import Btn from "@/components/Btn";
export default function Register() {
  const router = useRouter(); const [f, setF] = useState({ name: "", email: "", image: "", password: "" }); const [busy, setBusy] = useState(false);
  const [google, setGoogle] = useState(false);
  useEffect(() => { fetch("/api/config").then((r) => r.json()).then((d) => setGoogle(!!d.google)).catch(() => {}); }, []);
  const withGoogle = async () => {
    const { error } = await authClient.signIn.social({ provider: "google", callbackURL: "/" });
    if (error) toast.error(error.message || "Google sign-in failed.");
  };
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    if (!f.name.trim()) return toast.error("Enter your name.");
    if (!/^\S+@\S+\.\S+$/.test(f.email)) return toast.error("Enter a valid email address.");
    if (f.image && !/^https?:\/\//.test(f.image)) return toast.error("Photo URL must start with http or https.");
    if (!/[A-Z]/.test(f.password)) return toast.error("Password needs an uppercase letter.");
    if (!/[a-z]/.test(f.password)) return toast.error("Password needs a lowercase letter.");
    if (f.password.length < 6) return toast.error("Password needs at least 6 characters.");
    setBusy(true);
    const { error } = await authClient.signUp.email({ name: f.name, email: f.email, password: f.password, image: f.image || undefined });
    setBusy(false);
    if (error) return toast.error(error.message || "Could not create your account.");
    toast.success("Account created. Welcome to KindNest!"); router.push("/");
  };
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="paper tape p-7">
        <span className="sticker rounded-xl w-12 h-12 text-2xl -rotate-6 mb-4">🪺</span>
        <h1 className="sec-title">Create your account</h1>
        <p className="hand text-lg opacity-70 mt-0.5 mb-5">Pull up a chair — you belong here.</p>
        <form onSubmit={submit} className="grid gap-3">
          <input className="input w-full" placeholder="Full name" value={f.name} onChange={set("name")} />
          <input className="input w-full" placeholder="Email" value={f.email} onChange={set("email")} />
          <input className="input w-full" placeholder="Photo URL" value={f.image} onChange={set("image")} />
          <input type="password" className="input w-full" placeholder="Password" value={f.password} onChange={set("password")} />
          <Btn disabled={busy}>{busy ? <span className="loading loading-spinner" /> : "Create account"}</Btn>
        </form>
        {google && <Btn variant="dark" className="w-full mt-3" onClick={withGoogle}>Sign up with Google</Btn>}
      </div>
      <p className="mt-4 text-sm text-center">Already a member? <Link href="/login" className="link link-primary">Log in</Link></p>
    </div>
  );
}
