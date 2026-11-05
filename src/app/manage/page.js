"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import Guard from "@/components/Guard";
import EventCard from "@/components/EventCard";
import EventGrid from "@/components/EventGrid";
import EventForm from "@/components/EventForm";
import Btn from "@/components/Btn";
export default function Manage() {
  const [list, setList] = useState(null); const [edit, setEdit] = useState(null); const [del, setDel] = useState(null);
  const [error, setError] = useState("");
  const load = () => {
    setList(null);
    setError("");
    api("/my-events", { auth: true })
      .then(setList)
      .catch((e) => { setError(e.message); toast.error(e.message); });
  };
  useEffect(() => { load(); }, []);
  const remove = async () => { try { await api(`/events/${del}`, { method: "DELETE", auth: true }); toast.success("Event deleted."); load(); } catch (e) { toast.error(e.message); } setDel(null); };
  return (
    <Guard><div className="max-w-6xl mx-auto px-4 py-10"><h1 className="sec-title">Manage your events</h1>
      {error ? <div role="alert" className="paper p-6 mt-6 text-center">
        <p>{error}</p>
        <button type="button" className="btn btn-primary mt-4" onClick={load}>Try again</button>
      </div> : <EventGrid list={list} render={(ev) => <EventCard key={ev._id} ev={ev}>
        <Btn size="sm" variant="dark" onClick={() => setEdit(ev)}>Update</Btn>
        <Btn size="sm" variant="error" onClick={() => setDel(ev._id)}>Delete</Btn></EventCard>} />}
      {edit && <dialog open className="modal"><div className="modal-box"><h3 className="text-xl mb-3">Update event</h3>
        <EventForm initial={edit} label="Save changes" onSubmit={async (f) => { await api(`/events/${edit._id}`, { method: "PUT", body: f, auth: true }); toast.success("Event updated."); setEdit(null); load(); }} />
        <Btn variant="dark" className="w-full mt-2" onClick={() => setEdit(null)}>Cancel</Btn></div></dialog>}
      {del && <dialog open className="modal"><div className="modal-box"><h3 className="text-xl">Delete this event?</h3><p className="py-3">People who joined will no longer see it.</p>
        <div className="modal-action flex-wrap"><Btn onClick={() => setDel(null)}>Keep event</Btn><Btn variant="error" onClick={remove}>Delete event</Btn></div></div></dialog>}
    </div></Guard>
  );
}
