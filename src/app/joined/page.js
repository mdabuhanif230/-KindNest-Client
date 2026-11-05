"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import Guard from "@/components/Guard";
import EventCard from "@/components/EventCard";
import EventGrid from "@/components/EventGrid";
export default function Joined() {
  const [list, setList] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    setList(null);
    setError("");
    try {
      setList(await api("/joined", { auth: true }));
    } catch (e) {
      setError(e.message);
      toast.error(e.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return <Guard><div className="max-w-6xl mx-auto px-4 py-10"><h1 className="sec-title">Events you joined</h1>
    {error ? <div role="alert" className="paper p-6 mt-6 text-center">
      <p>{error}</p>
      <button type="button" className="btn btn-primary mt-4" onClick={load}>Try again</button>
    </div> : <EventGrid list={list} render={(ev) => <EventCard key={ev._id} ev={ev} />} />}
  </div></Guard>;
}
