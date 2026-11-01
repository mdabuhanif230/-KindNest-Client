"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
export default function Navbar() {
  const { data } = authClient.useSession(); const user = data?.user;
  const [dark, setDark] = useState(false);
  useEffect(() => { const t = localStorage.getItem("theme") || "light"; document.documentElement.dataset.theme = t; setDark(t === "dark"); }, []);
  const toggle = () => { const t = dark ? "light" : "dark"; document.documentElement.dataset.theme = t; localStorage.setItem("theme", t); setDark(!dark); };
  const out = async () => { await authClient.signOut(); toast.success("You're logged out."); };
  return (
    <div className="navbar bg-base-100 border-b border-base-300 px-4 sticky top-0 z-30">
      <div className="flex-1"><Link href="/" className="text-2xl font-extrabold text-primary">KindNest</Link></div>
      <Link href="/events" className="btn btn-ghost">Upcoming Events</Link>
      <button onClick={toggle} className="btn btn-ghost btn-circle" aria-label="Toggle theme">{dark ? "☀️" : "🌙"}</button>
      {user ? (
        <div className="flex items-center gap-2">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="tooltip tooltip-bottom" data-tip={user.name}>
              <img src={user.image || `https://api.dicebear.com/9.x/initials/svg?seed=${user.name}`} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
            </div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-200 rounded-box w-52 p-2 shadow z-40">
              <li><Link href="/create">Create Event</Link></li>
              <li><Link href="/manage">Manage Events</Link></li>
              <li><Link href="/joined">Joined Events</Link></li>
            </ul>
          </div>
          <button onClick={out} className="btn btn-outline btn-primary btn-sm">Logout</button>
        </div>
      ) : <Link href="/login" className="btn btn-primary btn-sm">Login</Link>}
    </div>
  );
}
