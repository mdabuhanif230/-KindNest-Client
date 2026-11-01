"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import Guard from "@/components/Guard";
import EventCard from "@/components/EventCard";
import EventGrid from "@/components/EventGrid";
export default function Joined() {
  const [list, setList] = useState(null);
  useEffect(() => { api("/joined", { auth: true }).then(setList).catch((e) => { toast.error(e.message); setList([]); }); }, []);
  return <Guard><div className="max-w-6xl mx-auto px-4 py-10"><h1 className="sec-title mb-6">Events you joined</h1>
    <EventGrid list={list} render={(ev) => <EventCard key={ev._id} ev={ev} />} /></div></Guard>;
}
