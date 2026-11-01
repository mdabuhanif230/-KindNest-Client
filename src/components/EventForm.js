"use client";
import { useState } from "react";
import toast from "react-hot-toast";
export const TYPES = ["Cleanup", "Plantation", "Donation", "Food Drive", "Blood Donation", "Education"];
export default function EventForm({ initial, onSubmit, label }) {
  const [f, setF] = useState(initial || { title: "", description: "", type: TYPES[0], thumbnail: "", location: "", date: "" });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const tomorrow = new Date(Date.now() + 864e5).toISOString().slice(0, 10);
  const submit = async (e) => {
    e.preventDefault();
    if (f.title.trim().length < 5) return toast.error("Title needs at least 5 characters.");
    if (f.description.trim().length < 20) return toast.error("Description needs at least 20 characters.");
    if (!/^https?:\/\//.test(f.thumbnail)) return toast.error("Thumbnail must be a valid image URL.");
    if (!f.location.trim()) return toast.error("Add a location.");
    if (!f.date || f.date < tomorrow) return toast.error("Pick a date in the future.");
    setBusy(true); try { await onSubmit(f); } catch (err) { toast.error(err.message); } setBusy(false);
  };
  return (
    <form onSubmit={submit} className="grid gap-3">
      <input className="input w-full" placeholder="Event title" value={f.title} onChange={set("title")} />
      <textarea className="textarea w-full h-28" placeholder="What will volunteers do, and what should they bring?" value={f.description} onChange={set("description")} />
      <select className="select w-full" value={f.type} onChange={set("type")}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select>
      <input className="input w-full" placeholder="Thumbnail image URL" value={f.thumbnail} onChange={set("thumbnail")} />
      <input className="input w-full" placeholder="Location, e.g. Mirpur 10, Dhaka" value={f.location} onChange={set("location")} />
      <input type="date" min={tomorrow} className="input w-full" value={f.date} onChange={set("date")} />
      <button className="btn btn-primary" disabled={busy}>{busy ? <span className="loading loading-spinner" /> : label}</button>
    </form>
  );
}
