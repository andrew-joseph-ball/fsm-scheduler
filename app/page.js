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

    const mapped = calls.map((call) => ({
      id: call.id,
      title: call.title,
      start: call.scheduled_date, // all-day event
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
  async function handleEventDrop(info) {
    const newDate = info.event.startStr;

    await fetch("/api/service-calls", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: info.event.id,
        scheduled_date: newDate,
      }),
    });

    await loadEvents();
  }

  return (
    <div className="bg-white rounded shadow p-4 min-w-0">
      <Calendar events={events} onEventDrop={handleEventDrop} />
    </div>
  );
}
