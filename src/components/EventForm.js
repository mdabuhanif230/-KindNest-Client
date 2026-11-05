"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import Btn from "@/components/Btn";
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
      <label className="grid gap-1">
        <span className="text-sm font-semibold">Event title</span>
        <input required minLength={5} className="input w-full" placeholder="Event title" value={f.title} onChange={set("title")} />
      </label>
      <label className="grid gap-1">
        <span className="text-sm font-semibold">Description</span>
        <textarea required minLength={20} className="textarea w-full h-28" placeholder="What will volunteers do, and what should they bring?" value={f.description} onChange={set("description")} />
      </label>
      <label className="grid gap-1">
        <span className="text-sm font-semibold">Event type</span>
        <select required className="select w-full" value={f.type} onChange={set("type")}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select>
      </label>
      <label className="grid gap-1">
        <span className="text-sm font-semibold">Thumbnail image URL</span>
        <input required type="url" className="input w-full" placeholder="https://example.com/image.jpg" value={f.thumbnail} onChange={set("thumbnail")} />
      </label>
      <label className="grid gap-1">
        <span className="text-sm font-semibold">Location</span>
        <input required className="input w-full" placeholder="e.g. Mirpur 10, Dhaka" value={f.location} onChange={set("location")} />
      </label>
      <label className="grid gap-1">
        <span className="text-sm font-semibold">Event date</span>
        <input required type="date" min={tomorrow} className="input w-full" value={f.date} onChange={set("date")} />
      </label>
      <Btn disabled={busy}>{busy ? <span className="loading loading-spinner" /> : label}</Btn>
    </form>
  );
}
