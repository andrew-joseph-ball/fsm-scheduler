"use client";

import { useEffect, useRef } from "react";
import { Draggable } from "@fullcalendar/interaction";

export default function UnscheduledCalls({ calls, onUnschedule }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    new Draggable(containerRef.current, {
      itemSelector: ".unscheduled-item",
      eventData: (el) => ({
        id: el.dataset.id,
        title: el.dataset.title,
        allDay: true,
      }),
    });
  }, [calls]);

  return (
    <div
      ref={containerRef}
      className="bg-white rounded shadow p-4 w-64"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        const id = e.dataTransfer.getData("text/plain");
        if (id) onUnschedule(Number(id));
      }}
    >
      <h3 className="font-bold mb-2">Unscheduled</h3>

      {calls.map((call) => (
        <div
          key={call.id}
          className="unscheduled-item cursor-move bg-gray-100 p-2 mb-2 rounded"
          data-id={call.id}
          data-title={call.title}
        >
          {call.title}
        </div>
      ))}
    </div>
  );
}
