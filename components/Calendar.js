"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";

export default function Calendar({}) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ----------------------------------------
     Load service calls from DB
  ----------------------------------------- */
  const loadServiceCalls = async () => {
    try {
      const res = await fetch("/api/service-calls", {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to load service calls");

      const data = await res.json();

      setEvents(
        data.map((call) => ({
          id: String(call.id),
          title: `${call.customer_name} – ${call.title}`,
          start: call.scheduled_date,
          allDay: true,
        })),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServiceCalls();
  }, []);

  /* ----------------------------------------
     Handle drag & drop / resize
  ----------------------------------------- */
  const updateSchedule = async (info) => {
    const event = info.event;

    const newDate = event.startStr; // YYYY-MM-DD format

    const res = await fetch("/api/service-calls", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: event.id,
        scheduled_date: newDate,
      }),
    });

    if (!res.ok) {
      alert("Unable to update schedule");
      info.revert();
    }
  };

  if (loading) {
    return <p className="text-gray-500">Loading schedule…</p>;
  }

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={events}
      editable
      eventDrop={updateSchedule}
      eventResize={updateSchedule}
      height="auto"
      dayMaxEvents
    />
  );
}
