"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import Btn from "@/components/Btn";
import { avatarImageUrl, initialAvatar, onAvatarError } from "@/lib/avatar";

export default function Navbar() {
  const { data } = authClient.useSession();
  const user = data?.user;
  const [dark, setDark] = useState(false);
  useEffect(() => { const t = localStorage.getItem("theme") || "light"; document.documentElement.dataset.theme = t; setDark(t === "dark"); }, []);
  const toggle = () => { const t = dark ? "light" : "dark"; document.documentElement.dataset.theme = t; localStorage.setItem("theme", t); setDark(!dark); };
  const out = async () => { await authClient.signOut(); toast.success("You're logged out."); };

  return (
    <div className="navbar bg-base-100/90 backdrop-blur border-b-2 border-dashed border-base-content/20 px-3 sm:px-4 sticky top-0 z-40 shadow-sm">
      {/* Logo — die-cut sticker mark */}
      <div className="flex-1">
        <Link href="/" className="flex items-center gap-2.5 text-xl sm:text-2xl font-extrabold">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-base-100 text-base-content border-2 border-base-content shadow-[3px_3px_0_var(--color-base-content)] -rotate-3 text-lg">🪺</span>
          <span className="text-base-content">Kind<span className="text-accent">Nest</span></span>
        </Link>
      </div>

      {/* Right side */}
      <div className="flex-none flex items-center gap-1 sm:gap-2">
        {/* Desktop: plain link. The row gets too crowded below sm, so the same
            link moves into the ☰ menu there. */}
        <span className="hidden sm:block">
          <Btn href="/events" size="sm" className="font-semibold">Upcoming Events</Btn>
        </span>

        {/* Mobile menu — die-cut sticker button matching the logo mark */}
        <div className="dropdown dropdown-end sm:hidden">
          <div
            tabIndex={0}
            role="button"
            aria-label="Open menu"
            className="grid place-items-center w-10 h-10 rounded-xl bg-base-100 border-2 border-base-content shadow-[3px_3px_0_var(--color-base-content)] -rotate-3 text-lg cursor-pointer transition-transform duration-200 hover:rotate-0"
          >
            ☰
          </div>
          <ul tabIndex={0} className="dropdown-content menu bg-base-100 border-2 border-base-content/20 rounded-box mt-3 w-52 p-2 shadow-[6px_6px_0_rgba(0,0,0,.2)] z-50">
            <li><Link href="/events">📅 Upcoming Events</Link></li>
            {user && <li><button type="button" onClick={out}>🚪 Logout</button></li>}
          </ul>
        </div>

        <Btn size="circle" variant="dark" onClick={toggle} aria-label="Toggle theme">
          {dark ? "☀️" : "🌙"}
        </Btn>

        {user ? (
          <>
            {/* Profile dropdown */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="tooltip tooltip-bottom" data-tip={user.name}>
                <div className="avatar online">
                  <div className="w-10 rounded-full overflow-hidden border-[3px] border-white shadow-[2px_3px_0_rgba(0,0,0,.25)] -rotate-3 transition-transform duration-200 hover:rotate-0">
                    <img
                      src={avatarImageUrl(user.image) || initialAvatar(user.name)}
                      onError={(e) => onAvatarError(e, avatarImageUrl(user.image), user.name)}
                      referrerPolicy="no-referrer"
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <div tabIndex={0} className="dropdown-content menu bg-base-100 border-2 border-base-content/20 rounded-box mt-3 w-64 p-2 shadow-[6px_6px_0_rgba(0,0,0,.2)] z-50">
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

            {/* Visible logout button (requirement) — on mobile it lives in the ☰ menu */}
            <span className="hidden sm:block">
              <Btn variant="dark" size="sm" onClick={out}>Logout</Btn>
            </span>
          </>
        ) : (
          <Btn href="/login" size="sm">Login</Btn>
        )}
      </div>
    </div>
  );
}
