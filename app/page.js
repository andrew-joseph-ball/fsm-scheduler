/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Calendar from "@/components/Calendar";

export default function Home() {
  const [events, setEvents] = useState([]);

  /* -----------------------------
     Load service calls → events
  ------------------------------ */
  const loadEvents = async () => {
    const res = await fetch("/api/service-calls", {
      cache: "no-store",
    });

    const calls = await res.json();

    const mapped = calls
      .filter((call) => call.scheduled_date) // IMPORTANT
      .map((call) => ({
        id: String(call.id),
        title: call.title,
        start: call.scheduled_date,
        allDay: true,
      }));

    setEvents(mapped);
  };

  /* -----------------------------
     Initial load
  ------------------------------ */
  useEffect(() => {
    loadEvents();
  }, []);

  /* -----------------------------
     Drag & drop handler
  ------------------------------ */
  const handleEventDrop = async (info) => {
    const scheduled_date = info.event.startStr.slice(0, 10); // YYYY-MM-DD

    await fetch("/api/service-calls", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: Number(info.event.id),
        scheduled_date,
      }),
    });

    await loadEvents();
  };

  return (
    <div className="bg-white rounded shadow p-4 min-w-0">
      <Calendar events={events} onEventDrop={handleEventDrop} />
    </div>
  );
}
