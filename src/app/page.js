"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import EventCard from "@/components/EventCard";
import EventGrid from "@/components/EventGrid";
const features = [
  ["Create a drive in minutes", "Post a clothes, blanket or food drive with a place and a date."],
  ["Join with one click", "Sign up for any upcoming event and see it in your joined list."],
  ["Only real, upcoming events", "Past events disappear automatically, so every card is actionable."],
  ["Manage what you started", "Edit or cancel your own events whenever plans change."],
];
export default function Home() {
  const [events, setEvents] = useState(null);
  useEffect(() => { api("/events?limit=6").then(setEvents).catch((e) => { toast.error(e.message); setEvents([]); }); }, []);
  return (
    <>
      <section className="bg-primary text-primary-content">
        <div className="max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl leading-tight">Winter is coming. Who is helping your street?</h1>
            <p className="mt-4 text-lg opacity-90">Find blanket drives, clothes distributions and cleanups in your neighbourhood, or start your own.</p>
            <div className="mt-6 flex gap-3"><Link href="/events" className="btn btn-secondary">Find an event</Link><Link href="/create" className="btn btn-outline text-primary-content">Start a drive</Link></div>
          </div>
          <img src="https://picsum.photos/seed/volunteers/900/600" alt="Volunteers handing out blankets" className="rounded-box w-full h-72 md:h-96 object-cover" />
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-4 pt-16">
        <h2 className="sec-title">What you can do here</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
          {features.map(([t, d]) => <div key={t} className="p-5 rounded-box bg-base-200 border border-base-300 h-full"><h3 className="font-bold text-lg">{t}</h3><p className="mt-2 text-sm opacity-80">{d}</p></div>)}
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-4 pt-16">
        <h2 className="sec-title">Happening soon</h2>
        <div className="mt-6"><EventGrid list={events} render={(ev) => <EventCard key={ev._id} ev={ev} />} /></div>
      </section>
      <section className="max-w-6xl mx-auto px-4 pt-16">
        <h2 className="sec-title">Moments from past drives</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {["clothes", "blanket", "plant", "cleanup", "food", "school", "blood", "river"].map((s) => <img key={s} src={`https://picsum.photos/seed/${s}/500/400`} alt={`${s} drive`} className="w-full h-40 object-cover rounded-box" />)}
        </div>
      </section>
      <section className="max-w-3xl mx-auto px-4 pt-16 text-center">
        <div className="p-8 rounded-box bg-secondary text-secondary-content">
          <h2 className="sec-title">Get new drives in your inbox</h2><p>One short email a week. No spam.</p>
          <div className="join mt-4 w-full max-w-md"><input className="input join-item w-full" placeholder="you@example.com" /><button className="btn join-item btn-neutral">Subscribe</button></div>
        </div>
      </section>
    </>
  );
}
