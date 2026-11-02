"use client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Guard from "@/components/Guard";
import EventForm from "@/components/EventForm";

export default function Create() {
  const router = useRouter();
  return (
    <Guard>
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="sec-title mb-6">Start a new drive</h1>
        <EventForm
          label="Create event"
          onSubmit={async (f) => {
            await api("/events", { method: "POST", body: f, auth: true });
            toast.success("Event created!");
            router.push("/events");
          }}
        />
      </div>
    </Guard>
  );
}
