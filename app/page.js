/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Calendar from "@/components/Calendar";
import JobSidebar from "@/components/JobSidebar";
import UnscheduledCalls from "@/components/UnscheduledCalls";

export default function Home() {
  const [calls, setCalls] = useState([]);

  /* -----------------------------
     Load service calls → events
  ------------------------------ */
  const loadServiceCalls = async () => {
    const res = await fetch("/api/service-calls", {
      cache: "no-store",
    });

    const data = await res.json();

    setCalls(data);
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
      title: call.customer_name,
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
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50 relative">
      {/* Calendar Area */}
      <div className="flex-1 p-4">
        <div className="bg-white rounded-xl shadow h-full p-4">
          <Calendar
            events={calendarEvents}
            onEventDrop={handleEventDrop}
            onEventReceive={handleEventReceive}
          />
        </div>
      </div>

      {/* Sidebar */}
      <JobSidebar
        pendingCalls={pendingCalls}
        partsOrderedCalls={partsOrderedCalls}
      />
    </div>
  );
}
