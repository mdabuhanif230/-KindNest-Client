"use client";
import { useEffect, useState, use } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

export default function EventDetail({ params }) {
  const { id } = use(params);
  const { data } = authClient.useSession();
  const [ev, setEv] = useState(null);
  const [missing, setMissing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    api(`/events/${id}`)
      .then((e) => { setEv(e); if (data?.user) checkJoined(); })
      .catch(() => setMissing(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const checkJoined = async () => {
    try {
      const list = await api("/joined", { auth: true });
      setJoined(list.some((e) => e._id === id));
    } catch { /* not logged in */ }
  };

  const join = async () => {
    setBusy(true);
    try { await api(`/events/${id}/join`, { method: "POST", auth: true }); setJoined(true); toast.success("You joined this event!"); }
    catch (e) { toast.error(e.message); }
    setBusy(false);
  };

  if (missing) return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <h1 className="sec-title">Event not found</h1>
      <p className="opacity-70 mt-2">It may have been removed by its creator.</p>
      <Link href="/events" className="btn btn-primary mt-6">Browse other events</Link>
    </div>
  );

  if (!ev) return (
    <div className="max-w-3xl mx-auto px-4 py-10 grid gap-4">
      <div className="skeleton h-72 w-full" /><div className="skeleton h-8 w-2/3" /><div className="skeleton h-40 w-full" />
    </div>
  );

  const past = ev.date < new Date().toISOString().slice(0, 10);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <img src={ev.thumbnail} alt={ev.title} className="w-full h-64 md:h-80 object-cover rounded-box" />
      <div className="flex items-center gap-3 mt-5">
        <span className="badge badge-secondary">{ev.type}</span>
        {past && <span className="badge badge-ghost">Past event</span>}
      </div>
      <h1 className="sec-title mt-2">{ev.title}</h1>
      <p className="opacity-80 mt-1">📍 {ev.location} &nbsp;·&nbsp; 🗓 {new Date(ev.date).toDateString()}</p>
      <p className="mt-5 whitespace-pre-line leading-relaxed">{ev.description}</p>
      <div className="mt-6">
        {past ? <p className="opacity-60">This event has already happened.</p>
          : joined ? <button className="btn btn-success" disabled>✓ You joined this event</button>
          : data ? <button className="btn btn-primary" onClick={join} disabled={busy}>{busy ? <span className="loading loading-spinner" /> : "Join this event"}</button>
          : <Link href="/login" className="btn btn-outline">Log in to join</Link>}
      </div>
    </div>
  );
}
