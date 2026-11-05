"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import EventCard from "@/components/EventCard";
import EventGrid from "@/components/EventGrid";
import Btn from "@/components/Btn";

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
  const [nl, setNl] = useState("");
  useEffect(() => { api("/events?limit=6").then(setEvents).catch((e) => { toast.error(e.message); setEvents([]); }); }, []);
  // Newsletter is decorative by spec — this only gives the button some feedback
  const subscribe = (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(nl)) return toast.error("Enter a valid email address.");
    setNl("");
    toast.success("Thanks for subscribing! 📬");
  };
  return (
    <>
      {/* Banner — bulletin board with a taped-up polaroid */}
      <section className="dots border-b-2 border-dashed border-base-content/20">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="sticker rounded-full px-4 py-1.5 text-sm uppercase tracking-wide -rotate-3">Neighbours helping neighbours</span>
            <h1 className="text-4xl md:text-6xl leading-tight mt-6">Winter is coming. <span className="hl">Who is helping your street?</span></h1>
            <p className="mt-4 text-lg opacity-80">Find blanket drives, clothes distributions and cleanups in your neighbourhood, or start your own.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Btn href="/events" variant="secondary">Find an event</Btn>
              <Btn href="/create" variant="dark">Start a drive</Btn>
            </div>
          </div>
          <figure className="tape tilt-r bg-white p-3 pb-8 mx-auto w-full max-w-md shadow-[6px_6px_0_rgba(0,0,0,.18)]">
            <img src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=900&h=600&fit=crop" alt="Volunteers handing out supplies" className="w-full h-64 md:h-80 object-cover" />
            <figcaption className="hand text-lg text-center mt-2 text-[#332a1f]">everyone’s welcome 💛</figcaption>
          </figure>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 pt-16">
        <h2 className="sec-title">What you can do here</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
          {features.map(([icon, t, d], i) => (
            <div key={t} className={`paper p-5 h-full tilt-hover ${i % 2 ? "tilt-r" : "tilt-l"}`}>
              <span className="sticker rounded-full w-12 h-12 text-2xl">{icon}</span>
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
          <Btn href="/events" size="sm" variant="dark">View all →</Btn>
        </div>
        <div className="mt-6"><EventGrid list={events} render={(ev) => <EventCard key={ev._id} ev={ev} />} /></div>
      </section>

      {/* Gallery — taped-up polaroids */}
      <section className="max-w-6xl mx-auto px-4 pt-16">
        <h2 className="sec-title">Moments from past drives</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-6">
          {gallery.map(([src, cap], i) => (
            <figure key={cap} className={`bg-white p-2 pb-6 shadow-[4px_4px_0_rgba(0,0,0,.15)] tilt-hover group ${i % 2 ? "tilt-r" : "tilt-l"}`}>
              <div className="overflow-hidden">
                <img src={src} alt={cap} className="w-full h-32 md:h-36 object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <figcaption className="hand text-lg text-center mt-1.5 text-[#332a1f]">{cap}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Newsletter — a note pinned to the board */}
      <section className="max-w-3xl mx-auto px-4 pt-16 text-center">
        <div className="paper tape p-8">
          <h2 className="sec-title">Get new drives in your inbox</h2>
          <p className="hand text-lg">One short email a week. No spam, promise.</p>
          <form onSubmit={subscribe} className="join mt-4 w-full max-w-md">
            <input className="input join-item w-full" placeholder="you@example.com" value={nl} onChange={(e) => setNl(e.target.value)} />
            <Btn type="submit" size="sm" variant="neutral" className="join-item">Subscribe</Btn>
          </form>
        </div>
      </section>
    </>
  );
}
