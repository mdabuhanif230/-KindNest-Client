"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import EventCard from "@/components/EventCard";
import EventGrid from "@/components/EventGrid";

const features = [
  ["👕", "Create a drive in minutes", "Post a clothes, blanket or food drive with a place and a date."],
  ["🤝", "Join with one click", "Sign up for any upcoming event and see it in your joined list."],
  ["📆", "Only real, upcoming events", "Past events disappear automatically, so every card is actionable."],
  ["🛠️", "Manage what you started", "Edit or cancel your own events whenever plans change."],
];

// Free Unsplash photos themed to community service (all verified to load)
const gallery = [
  ["https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=500&h=400&fit=crop", "Winter clothes drive"],
  ["https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=500&h=400&fit=crop", "Volunteers at work"],
  ["https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=500&h=400&fit=crop", "Community tree plantation"],
  ["https://images.unsplash.com/photo-1593113630400-ea4288922497?w=500&h=400&fit=crop", "Food distribution"],
  ["https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=500&h=400&fit=crop", "Blood donation camp"],
  ["https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=500&h=400&fit=crop", "Neighbourhood cleanup"],
  ["https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=500&h=400&fit=crop", "Community kitchen"],
  ["https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=500&h=400&fit=crop", "Medical & relief camp"],
];

export default function Home() {
  const [events, setEvents] = useState(null);
  useEffect(() => { api("/events?limit=6").then(setEvents).catch((e) => { toast.error(e.message); setEvents([]); }); }, []);
  return (
    <>
      {/* Banner */}
      <section className="bg-primary text-primary-content">
        <div className="max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="badge badge-secondary badge-lg mb-4">Neighbours helping neighbours</span>
            <h1 className="text-4xl md:text-6xl leading-tight">Winter is coming. Who is helping your street?</h1>
            <p className="mt-4 text-lg opacity-90">Find blanket drives, clothes distributions and cleanups in your neighbourhood, or start your own.</p>
            <div className="mt-6 flex gap-3">
              <Link href="/events" className="btn btn-secondary">Find an event</Link>
              <Link href="/create" className="btn btn-outline text-primary-content">Start a drive</Link>
            </div>
          </div>
          <img src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=900&h=600&fit=crop" alt="Volunteers handing out supplies" className="rounded-box w-full h-72 md:h-96 object-cover shadow-lg" />
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 pt-16">
        <h2 className="sec-title">What you can do here</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
          {features.map(([icon, t, d]) => (
            <div key={t} className="p-5 rounded-box bg-base-200 border border-base-300 h-full transition-transform hover:-translate-y-1">
              <span className="text-3xl">{icon}</span>
              <h3 className="font-bold text-lg mt-3">{t}</h3>
              <p className="mt-2 text-sm opacity-80">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent upcoming events */}
      <section className="max-w-6xl mx-auto px-4 pt-16">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="sec-title">Happening soon</h2>
          <Link href="/events" className="btn btn-ghost btn-sm">View all →</Link>
        </div>
        <div className="mt-6"><EventGrid list={events} render={(ev) => <EventCard key={ev._id} ev={ev} />} /></div>
      </section>

      {/* Gallery */}
      <section className="max-w-6xl mx-auto px-4 pt-16">
        <h2 className="sec-title">Moments from past drives</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {gallery.map(([src, cap]) => (
            <figure key={cap} className="relative rounded-box overflow-hidden group h-40">
              <img src={src} alt={cap} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">{cap}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-3xl mx-auto px-4 pt-16 text-center">
        <div className="p-8 rounded-box bg-secondary text-secondary-content">
          <h2 className="sec-title">Get new drives in your inbox</h2>
          <p>One short email a week. No spam.</p>
          <div className="join mt-4 w-full max-w-md">
            <input className="input join-item w-full" placeholder="you@example.com" />
            <button className="btn join-item btn-neutral">Subscribe</button>
          </div>
        </div>
      </section>
    </>
  );
}
