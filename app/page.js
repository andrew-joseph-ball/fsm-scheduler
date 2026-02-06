/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Calendar from "@/components/Calendar";
import { Draggable } from "@fullcalendar/interaction";
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
    info.event.remove();

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
    .filter((call) => call.status === "Scheduled")
    .map((call) => ({
      id: String(call.id),
      title: `${call.customer_name} – ${call.title}`,
      start: call.scheduled_date,
      allDay: true,
    }));

  const pendingCalls = calls.filter((call) => call.status === "Pending");

  const partsOrderedCalls = calls.filter(
    (call) => call.status === "Parts Ordered",
  );

  useEffect(() => {
    const pendingEl = document.getElementById("pending-calls");
    if (pendingEl) {
      new Draggable(pendingEl, {
        itemSelector: ".draggable-item",
        eventData: (el) => ({
          id: el.dataset.id,
          title: el.dataset.title,
        }),
      });
    }

    const partsEl = document.getElementById("parts-ordered-calls");
    if (partsEl) {
      new Draggable(partsEl, {
        itemSelector: ".draggable-item",
        eventData: (el) => ({
          id: el.dataset.id,
          title: el.dataset.title,
        }),
      });
    }
  }, [pendingCalls, partsOrderedCalls]);

  return (
    <div>
      <div className="bg-white rounded shadow p-4 min-w-0">
        {/* Calendar Component */}
        <Calendar events={events} onEventDrop={handleEventDrop} />
      </div>

      {/* Pending / Unscheduled call drawer */}
      <div id="pending-calls">
        <h3 className="font-semibold mb-2">Pending</h3>

        {pendingCalls.map((call) => (
          <div
            key={call.id}
            className="draggable-item cursor-move p-2 mb-2 bg-gray-100 rounded"
            data-id={call.id}
            data-title={`${call.customer_name} – ${call.title}`}
          >
            {call.customer_name} – {call.title}
          </div>
        ))}
      </div>

      {/* Parts Ordered call drawer */}
      <div id="parts-ordered-calls">
        <h3 className="font-semibold mb-2">Parts Ordered</h3>

        {partsOrderedCalls.map((call) => (
          <div
            key={call.id}
            className="draggable-item cursor-move p-2 mb-2 bg-yellow-100 rounded"
            data-id={call.id}
            data-title={`${call.customer_name} – ${call.title}`}
          >
            {call.customer_name} – {call.title}
          </div>
        ))}
      </div>
    </div>
  );
}
