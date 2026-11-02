"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
export default function Register() {
  const router = useRouter(); const [f, setF] = useState({ name: "", email: "", image: "", password: "" }); const [busy, setBusy] = useState(false);
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
    <div className="max-w-md mx-auto px-4 py-12"><h1 className="sec-title">Create your account</h1>
      <form onSubmit={submit} className="grid gap-3">
        <input className="input w-full" placeholder="Full name" value={f.name} onChange={set("name")} />
        <input className="input w-full" placeholder="Email" value={f.email} onChange={set("email")} />
        <input className="input w-full" placeholder="Photo URL" value={f.image} onChange={set("image")} />
        <input type="password" className="input w-full" placeholder="Password" value={f.password} onChange={set("password")} />
        <button className="btn btn-primary" disabled={busy}>{busy ? <span className="loading loading-spinner" /> : "Create account"}</button>
      </form>
      <p className="mt-4 text-sm">Already a member? <Link href="/login" className="link link-primary">Log in</Link></p>
    </div>
  );
}
