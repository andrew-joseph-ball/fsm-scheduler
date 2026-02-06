/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Calendar from "@/components/Calendar";
import UnscheduledCalls from "@/components/UnscheduledCalls";

export default function Home() {
  const [calls, setCalls] = useState([]);
  const [events, setEvents] = useState([]);

  /* -----------------------------
     Load service calls → events
  ------------------------------ */
  const loadServiceCalls = async () => {
    const res = await fetch("/api/service-calls", {
      cache: "no-store",
    });

    const data = await res.json();

    setCalls(data);

    const mappedEvents = data
      .filter((call) => call.scheduled_date)
      .map((call) => ({
        id: String(call.id),
        title: call.title,
        start: call.scheduled_date,
        allDay: true,
      }));

    setEvents(mappedEvents);
  };

  /* -----------------------------
     Initial load
  ------------------------------ */
  useEffect(() => {
    loadServiceCalls();
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

    await loadServiceCalls();
  };

  /* -----------------------------
     Event Receive handler
     ---------------------------- */
  const handleEventReceive = async (info) => {
    info.event.remove(); // remove temp

    await fetch("/api/service-calls", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: Number(info.event.id),
        scheduled_date: info.event.startStr.slice(0, 10),
        status: "Scheduled",
      }),
    });

    await loadServiceCalls();
  };

  const unscheduledCalls = calls.filter((call) => call.status === "Pending");

  const handleUnschedule = async (id) => {
    await fetch("/api/service-calls", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        scheduled_date: null,
        status: "Pending",
      }),
    });

    await loadServiceCalls();
  };

  const calendarEvents = calls
    .filter((call) => call.status !== "Pending")
    .map((call) => ({
      id: String(call.id),
      title: `${call.customer_name} – ${call.title}`,
      start: call.scheduled_date,
      allDay: true,
    }));

  return (
    <div className="bg-white rounded shadow p-4 min-w-0">
      <Calendar events={events} onEventDrop={handleEventDrop} />
      <UnscheduledCalls
        calls={unscheduledCalls}
        onUnschedule={handleUnschedule}
      />
    </div>
  );
}
