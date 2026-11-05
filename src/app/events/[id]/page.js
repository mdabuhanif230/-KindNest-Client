"use client";
import { useEffect, useState, use } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import Btn from "@/components/Btn";

export default function EventDetail({ params }) {
  const { id } = use(params);
  const { data } = authClient.useSession();
  const [ev, setEv] = useState(null);
  const [missing, setMissing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    let alive = true;
    api(`/events/${id}`)
      .then((e) => { if (alive) setEv(e); })
      .catch(() => { if (alive) setMissing(true); });
    return () => { alive = false; };
  }, [id]);

  // Separate from the event fetch: the session can resolve after the event
  // arrives, so this re-runs whenever the user changes.
  useEffect(() => {
    if (!data?.user) { setJoined(false); return; }
    let alive = true;
    api("/joined", { auth: true })
      .then((list) => { if (alive) setJoined(list.some((e) => e._id === id)); })
      .catch(() => { if (alive) setJoined(false); });
    return () => { alive = false; };
  }, [id, data?.user]);

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
      <Btn href="/events" className="mt-6">Browse other events</Btn>
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
      <figure className="tape tilt-r bg-white p-3 shadow-[6px_6px_0_rgba(0,0,0,.16)]">
        <img src={ev.thumbnail || ev.image} alt={ev.title} className="w-full h-64 md:h-80 object-cover" />
      </figure>
      <div className="flex items-center gap-3 mt-7">
        <span className="badge badge-secondary -rotate-2">{ev.type || ev.category}</span>
        {past && <span className="badge badge-ghost">Past event</span>}
      </div>
      <h1 className="sec-title mt-2">{ev.title}</h1>
      <p className="opacity-80 mt-1">📍 {ev.location} &nbsp;·&nbsp; 🗓 {new Date(ev.date).toDateString()}</p>
      <div className="paper p-6 mt-5 whitespace-pre-line leading-relaxed">{ev.description}</div>
      <div className="mt-6">
        {past ? <p className="opacity-60">This event has already happened.</p>
          : joined ? <Btn variant="success" disabled>✓ You joined this event</Btn>
          : data ? <Btn onClick={join} disabled={busy}>{busy ? <span className="loading loading-spinner" /> : "Join this event"}</Btn>
          : <Btn href="/login" variant="dark">Log in to join</Btn>}
      </div>
    </div>
  );
}
