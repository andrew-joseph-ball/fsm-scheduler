"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function Calendar({
  events,
  onEventDrop,
  onEventReceive,
  onEventClick,
}) {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={events}
      editable={true}
      droppable={true}
      eventDrop={onEventDrop}
      eventReceive={onEventReceive}
      eventClick={onEventClick}
      eventDidMount={(info) => {
        const description = info.event.extendedProps.description;

        if (description) {
          info.el.title = description;
        }
      }}
    />
  );
}
