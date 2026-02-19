"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function Calendar({ events, onEventDrop, onEventReceive }) {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={events}
      editable={true}
      droppable={true}
      eventDrop={onEventDrop}
      eventReceive={onEventReceive}
      eventResizableFromStart={false}
    />
  );
}
