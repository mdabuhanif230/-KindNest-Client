"use client";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/api";
import Guard from "@/components/Guard";
import Btn from "@/components/Btn";
import { initialAvatar, onAvatarError, fileToAvatar } from "@/lib/avatar";

const initials = (n) => initialAvatar(n);
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
  const [pending, setPending] = useState(""); // compressed photo picked from the device, not yet saved
  const [imgBusy, setImgBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [stats, setStats] = useState(null);
  const fileRef = useRef(null);

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
    try {
      let finalImage = image.trim();
      if (pending) {
        const { path } = await api("/avatar", { method: "POST", body: { image: pending }, auth: true });
        finalImage = process.env.NEXT_PUBLIC_API_URL + path;
      }
      const { error } = await authClient.updateUser({ name: name.trim(), image: finalImage || undefined });
      if (error) throw new Error(error.message || "Could not update your profile.");
      setImage(finalImage);
      setPending("");
      toast.success("Profile updated!");
      router.refresh();
    } catch (err) {
      toast.error(err.message || "Could not update your profile.");
    } finally {
      setBusy(false);
    }
  };

  const onPick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // let the same file be picked again
    if (!file) return;
    setImgBusy(true);
    try {
      setPending(await fileToAvatar(file));
      setImage(""); // the upload and the URL field are mutually exclusive — last action wins
      toast.success("Photo ready — press Save changes to apply it.");
    } catch (err) {
      toast.error(err.message || "Could not read that photo.");
    } finally {
      setImgBusy(false);
    }
  };

  const reset = () => { setName(user?.name || ""); setImage(user?.image || ""); setPending(""); };
  const randomAvatar = () => { setImage(`https://api.dicebear.com/9.x/adventurer/svg?seed=${Math.random().toString(36).slice(2, 8)}`); setPending(""); };
  const copyId = async () => {
    try { await navigator.clipboard.writeText(user?.id || ""); toast.success("User ID copied."); }
    catch { toast.error("Could not copy the ID."); }
  };

  const dirty = ready && (name.trim() !== (user?.name || "") || image.trim() !== (user?.image || "") || !!pending);
  const avatar = pending || image.trim() || user?.image || initials(user?.name);
  const num = (v) => (Array.isArray(v) ? v.length : v === null ? "—" : undefined);
  const upcoming = Array.isArray(stats?.mine) ? stats.mine.filter((ev) => ev.date >= today()).length : stats ? "—" : undefined;
  const onImgError = (e) => onAvatarError(e, avatar, user?.name);

  return (
    <Guard>
      <div className="max-w-4xl mx-auto px-4 py-10 grid gap-6">
        <h1 className="sec-title">Your profile</h1>

        {/* hero card — market-awning stripes + die-cut avatar */}
        <div className="paper overflow-hidden">
          <div className="h-28 sm:h-36 border-b-2 border-dashed border-base-content/20" style={{ backgroundImage: "repeating-linear-gradient(45deg, var(--color-primary) 0 26px, var(--color-secondary) 26px 52px)" }} />
          <div className="px-5 pb-5">
            <div className="flex flex-wrap items-end gap-4 -mt-12">
              <img
                src={avatar}
                onError={onImgError}
                alt={user?.name || "profile"}
                className="w-24 h-24 rounded-full object-cover bg-base-200 border-[5px] border-white shadow-[4px_4px_0_rgba(0,0,0,.2)] -rotate-3 transition-transform duration-200 hover:rotate-0"
              />
              <div className="pb-1 min-w-[12rem] flex-1">
                <p className="text-2xl font-extrabold leading-tight">{user?.name}</p>
                <p className="text-sm opacity-70">{user?.email}</p>
              </div>
              <div className="pb-2 flex flex-wrap gap-2">
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
          {/* edit form — min-w-0 keeps the card inside its grid column even when
              the chunky buttons would otherwise force it wider */}
          <form onSubmit={submit} className="paper tape p-6 grid content-start gap-4 min-w-0">
            <div>
              <h2 className="text-lg font-extrabold">Update profile</h2>
              <p className="text-sm opacity-70">Your name shows up on every event you create or join.</p>
            </div>

            <label className="grid gap-1.5">
              <span className="text-sm font-semibold opacity-80">Full name</span>
              <input className="input w-full" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
            </label>

            <div className="grid gap-1.5">
              <span className="text-sm font-semibold opacity-80">Profile photo</span>
              <div className="flex items-center gap-3 flex-wrap">
                <img src={avatar} onError={onImgError} alt="preview" className="w-12 h-12 rounded-full object-cover bg-base-200 shrink-0 border-[3px] border-white shadow-[2px_2px_0_rgba(0,0,0,.18)] -rotate-2" />
                <div className="flex gap-2 flex-wrap">
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPick} />
                  <Btn type="button" size="sm" variant="dark" onClick={() => fileRef.current?.click()} disabled={imgBusy}>
                    {imgBusy ? "Reading photo…" : "📤 Upload from device"}
                  </Btn>
                  {pending ? <Btn type="button" size="sm" variant="error" onClick={() => setPending("")}>✕ Remove</Btn> : null}
                </div>
              </div>
              <p className="text-xs opacity-60">
                {pending ? "Photo ready — press Save changes to apply it." : "JPG/PNG/WebP up to 15MB, cropped to a square. Or paste a direct image link below."}
              </p>
            </div>

            <label className="grid gap-1.5">
              <span className="text-sm font-semibold opacity-80">Photo URL</span>
              <input className="input w-full" placeholder="https://…/photo.jpg" value={image} onChange={(e) => { setImage(e.target.value); setPending(""); }} />
              <span className="text-xs opacity-60">Must start with http:// or https://</span>
            </label>

            <div className="flex flex-wrap gap-2">
              <Btn type="button" size="sm" variant="dark" onClick={randomAvatar}>🎲 Random avatar</Btn>
              <Btn type="button" size="sm" variant="dark" onClick={reset} disabled={!dirty}>Reset</Btn>
            </div>

            {/* stacked: the two chunky buttons can't share one row inside a half-width column */}
            <div className="grid gap-2 mt-1">
              <Btn disabled={busy || !dirty}>
                {busy ? <span className="loading loading-spinner" /> : "Save changes"}
              </Btn>
              <Btn href="/manage" variant="dark">My events</Btn>
            </div>
            {!dirty && ready ? <p className="text-xs opacity-60">Nothing to save yet — edit something first.</p> : null}
          </form>

          {/* account card */}
          <div className="paper tape p-6 grid content-start gap-4 min-w-0">
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
                <Btn type="button" size="xs" variant="dark" onClick={copyId}>Copy</Btn>
              </div>
            </div>

            <div className="grid gap-2 mt-1">
              <Btn href="/manage" size="sm" variant="dark" className="justify-start">🛠 Manage your events</Btn>
              <Btn href="/joined" size="sm" variant="dark" className="justify-start">🧾 Events you joined</Btn>
              <Btn href="/create" size="sm" variant="dark" className="justify-start">➕ Create an event</Btn>
            </div>
          </div>
        </div>
      </div>
    </Guard>
  );
}
