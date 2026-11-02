"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import EventCard from "@/components/EventCard";
import EventGrid from "@/components/EventGrid";

const TYPES = ["Cleanup", "Plantation", "Donation", "Food Drive", "Blood Donation", "Education"];

export default function Events() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 py-10"><div className="skeleton h-96 w-full" /></div>}>
      <EventsInner />
    </Suspense>
  );
}

function EventsInner() {
  const params = useSearchParams();
  const router = useRouter();
  const [events, setEvents] = useState(null);
  const [type, setType] = useState(params.get("type") || "");
  const [search, setSearch] = useState(params.get("search") || "");

  const load = () => {
    setEvents(null);
    const q = new URLSearchParams();
    if (type) q.set("type", type);
    if (search.trim()) q.set("search", search.trim());
    api(`/events${q.size ? `?${q}` : ""}`)
      .then(setEvents)
      .catch((e) => { toast.error(e.message); setEvents([]); });
  };

  useEffect(() => { load(); }, [type]); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = (e) => { e.preventDefault(); load(); router.push(`/events?type=${encodeURIComponent(type)}&search=${encodeURIComponent(search.trim())}`, { scroll: false }); };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="sec-title">Upcoming events</h1>
      <form onSubmit={submit} className="flex flex-wrap gap-3 mt-4">
        <input className="input w-full sm:w-72" placeholder="Search by title…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="select w-full sm:w-56" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All types</option>
          {TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
        <button className="btn btn-primary">Search</button>
      </form>
      <div className="mt-8">
        <EventGrid list={events} render={(ev) => <EventCard key={ev._id} ev={ev} />} />
      </div>
    </div>
  );
}
