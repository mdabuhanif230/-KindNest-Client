"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/api";
import Guard from "@/components/Guard";

const initials = (n) => `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent((n || "u").trim() || "u")}`;
const today = () => new Date().toISOString().slice(0, 10);
const since = (d) => (d ? new Date(d).toLocaleDateString("en-GB", { month: "short", year: "numeric" }) : "—");

function Stat({ label, value, hint }) {
  return (
    <div className="rounded-box bg-base-200 px-4 py-3">
      <p className="text-[11px] uppercase tracking-wide opacity-60">{label}</p>
      {value === undefined ? <span className="skeleton h-7 w-10 mt-1 inline-block" /> : <p className="text-2xl font-extrabold text-primary">{value}</p>}
      {hint ? <p className="text-xs opacity-60">{hint}</p> : null}
    </div>
  );
}

export default function Profile() {
  const router = useRouter();
  const { data } = authClient.useSession();
  const user = data?.user;

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [stats, setStats] = useState(null);

  // session loads after first paint, so fill the fields once it arrives
  useEffect(() => {
    if (!user) return;
    setName(user.name || "");
    setImage(user.image || "");
    setReady(true);
  }, [user]);

  useEffect(() => {
    if (!user?.email) return;
    let alive = true;
    Promise.all([api("/my-events", { auth: true }), api("/joined", { auth: true })])
      .then(([mine, joined]) => { if (alive) setStats({ mine, joined }); })
      .catch((e) => { if (alive) { setStats({ mine: null, joined: null }); toast.error(e.message); } });
    return () => { alive = false; };
  }, [user?.email]);

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name cannot be empty.");
    if (image && !/^https?:\/\//.test(image)) return toast.error("Photo URL must start with http or https.");
    setBusy(true);
    const { error } = await authClient.updateUser({ name: name.trim(), image: image.trim() || undefined });
    setBusy(false);
    if (error) return toast.error(error.message || "Could not update your profile.");
    toast.success("Profile updated!");
    router.refresh();
  };

  const reset = () => { setName(user?.name || ""); setImage(user?.image || ""); };
  const randomAvatar = () => setImage(`https://api.dicebear.com/9.x/adventurer/svg?seed=${Math.random().toString(36).slice(2, 8)}`);
  const copyId = async () => {
    try { await navigator.clipboard.writeText(user?.id || ""); toast.success("User ID copied."); }
    catch { toast.error("Could not copy the ID."); }
  };

  const dirty = ready && (name.trim() !== (user?.name || "") || image.trim() !== (user?.image || ""));
  const avatar = image.trim() || user?.image || initials(user?.name);
  const num = (v) => (Array.isArray(v) ? v.length : v === null ? "—" : undefined);
  const upcoming = Array.isArray(stats?.mine) ? stats.mine.filter((ev) => ev.date >= today()).length : stats ? "—" : undefined;
  const onImgError = (e) => {
    const el = e.currentTarget;
    if (el.dataset.fb !== "1") { el.dataset.fb = "1"; el.src = initials(user?.name); }
  };

  return (
    <Guard>
      <div className="max-w-4xl mx-auto px-4 py-10 grid gap-6">
        <h1 className="sec-title">Your profile</h1>

        {/* hero card */}
        <div className="rounded-box overflow-hidden border border-base-300 bg-base-100">
          <div className="h-28 sm:h-36 bg-gradient-to-r from-primary via-primary/70 to-secondary" />
          <div className="px-5 pb-5">
            <div className="flex flex-wrap items-end gap-4 -mt-12">
              <img
                src={avatar}
                onError={onImgError}
                alt={user?.name || "profile"}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-base-100 bg-base-200"
              />
              <div className="pb-1 min-w-[12rem] flex-1">
                <p className="text-2xl font-extrabold leading-tight">{user?.name}</p>
                <p className="text-sm opacity-70">{user?.email}</p>
              </div>
              <div className="pb-2 flex flex-wrap gap-2">
                {user?.emailVerified ? <span className="badge badge-success">Email verified</span> : <span className="badge badge-warning">Unverified</span>}
                <span className="badge badge-outline">Since {since(user?.createdAt)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
              <Stat label="Events created" value={stats ? num(stats.mine) : undefined} hint="You are the organizer" />
              <Stat label="Events joined" value={stats ? num(stats.joined) : undefined} hint="Neighbourhoods you help" />
              <Stat label="Upcoming" value={upcoming} hint="Created & still ahead" />
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* edit form */}
          <form onSubmit={submit} className="rounded-box border border-base-300 bg-base-100 p-5 grid content-start gap-4">
            <div>
              <h2 className="text-lg font-extrabold">Update profile</h2>
              <p className="text-sm opacity-70">Your name shows up on every event you create or join.</p>
            </div>

            <label className="grid gap-1.5">
              <span className="text-sm font-semibold opacity-80">Full name</span>
              <input className="input w-full" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
            </label>

            <label className="grid gap-1.5">
              <span className="text-sm font-semibold opacity-80">Photo URL</span>
              <div className="flex gap-2 items-center">
                <input className="input w-full" placeholder="https://…/photo.jpg" value={image} onChange={(e) => setImage(e.target.value)} />
                <img src={avatar} onError={onImgError} alt="preview" className="w-10 h-10 rounded-full object-cover bg-base-200 shrink-0" />
              </div>
              <span className="text-xs opacity-60">Must start with http:// or https://</span>
            </label>

            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn btn-ghost btn-sm" onClick={randomAvatar}>🎲 Random avatar</button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={reset} disabled={!dirty}>Reset</button>
            </div>

            <div className="flex gap-2 mt-1">
              <button className="btn btn-primary flex-1" disabled={busy || !dirty}>
                {busy ? <span className="loading loading-spinner" /> : "Save changes"}
              </button>
              <Link href="/manage" className="btn btn-outline">My events</Link>
            </div>
            {!dirty && ready ? <p className="text-xs opacity-60">Nothing to save yet — edit something first.</p> : null}
          </form>

          {/* account card */}
          <div className="rounded-box border border-base-300 bg-base-100 p-5 grid content-start gap-4">
            <div>
              <h2 className="text-lg font-extrabold">Account</h2>
              <p className="text-sm opacity-70">Read-only details from your login.</p>
            </div>

            <div className="grid gap-3">
              <div className="rounded-box bg-base-200 px-4 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-wide opacity-60">Email</p>
                  <p className="font-semibold truncate">{user?.email}</p>
                </div>
                {user?.emailVerified ? <span className="badge badge-success badge-sm">Verified</span> : <span className="badge badge-warning badge-sm">Pending</span>}
              </div>

              <div className="rounded-box bg-base-200 px-4 py-3">
                <p className="text-[11px] uppercase tracking-wide opacity-60">Member since</p>
                <p className="font-semibold">{since(user?.createdAt)}</p>
              </div>

              <div className="rounded-box bg-base-200 px-4 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-wide opacity-60">User ID</p>
                  <p className="font-mono text-xs truncate">{user?.id}</p>
                </div>
                <button type="button" className="btn btn-ghost btn-xs" onClick={copyId}>Copy</button>
              </div>
            </div>

            <div className="grid gap-2 mt-1">
              <Link href="/manage" className="btn btn-outline btn-sm justify-start">🛠 Manage your events</Link>
              <Link href="/joined" className="btn btn-outline btn-sm justify-start">🧾 Events you joined</Link>
              <Link href="/create" className="btn btn-outline btn-sm justify-start">➕ Create an event</Link>
            </div>
          </div>
        </div>
      </div>
    </Guard>
  );
}
