"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const { data } = authClient.useSession();
  const user = data?.user;
  const [dark, setDark] = useState(false);
  useEffect(() => { const t = localStorage.getItem("theme") || "light"; document.documentElement.dataset.theme = t; setDark(t === "dark"); }, []);
  const toggle = () => { const t = dark ? "light" : "dark"; document.documentElement.dataset.theme = t; localStorage.setItem("theme", t); setDark(!dark); };
  const out = async () => { await authClient.signOut(); toast.success("You're logged out."); };

  return (
    <div className="navbar bg-base-100/90 backdrop-blur border-b border-base-300 px-3 sm:px-4 sticky top-0 z-40 shadow-sm">
      {/* Logo */}
      <div className="flex-1">
        <Link href="/" className="flex items-center gap-2 text-xl sm:text-2xl font-extrabold">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-primary text-primary-content text-lg shadow-md shadow-primary/30">🪺</span>
          <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">KindNest</span>
        </Link>
      </div>

      {/* Right side */}
      <div className="flex-none flex items-center gap-1 sm:gap-2">
        <Link href="/events" className="btn btn-ghost btn-sm sm:btn-md font-semibold">Upcoming Events</Link>

        <button onClick={toggle} className="btn btn-ghost btn-circle btn-sm sm:btn-md" aria-label="Toggle theme">
          {dark ? "☀️" : "🌙"}
        </button>

        {user ? (
          <>
            {/* Profile dropdown */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="tooltip tooltip-bottom" data-tip={user.name}>
                <div className="avatar online">
                  <div className="w-10 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                    <img src={user.image || `https://api.dicebear.com/9.x/initials/svg?seed=${user.name}`} alt={user.name} />
                  </div>
                </div>
              </div>
              <div tabIndex={0} className="dropdown-content menu bg-base-200 border border-base-300 rounded-box mt-3 w-64 p-2 shadow-2xl z-50">
                <div className="px-3 py-2 mb-1 rounded-lg bg-primary text-primary-content">
                  <p className="font-bold truncate">{user.name}</p>
                  <p className="text-xs opacity-80 truncate">{user.email}</p>
                </div>
                <li><Link href="/profile">👤 My Profile</Link></li>
                <li><Link href="/create">➕ Create Event</Link></li>
                <li><Link href="/manage">🛠️ Manage Events</Link></li>
                <li><Link href="/joined">🎫 Joined Events</Link></li>
              </div>
            </div>

            {/* Visible logout button (requirement) */}
            <button onClick={out} className="btn btn-outline btn-primary btn-sm sm:btn-md">Logout</button>
          </>
        ) : (
          <Link href="/login" className="btn btn-primary btn-sm sm:btn-md">Login</Link>
        )}
      </div>
    </div>
  );
}
