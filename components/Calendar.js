"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { useEffect, useRef, useState } from "react";

export default function Calendar({ events, onEventDrop }) {
  const calendarRef = useRef(null);
  const [isNarrow, setIsNarrow] = useState(false);

  /* -----------------------------
     Detect viewport width
  ------------------------------ */
  useEffect(() => {
    const checkWidth = () => {
      setIsNarrow(window.innerWidth < 900);
    };

    checkWidth();
    window.addEventListener("resize", checkWidth);

    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  /* -----------------------------
     Force calendar resize
  ------------------------------ */
  useEffect(() => {
    calendarRef.current?.getApi().updateSize();
  }, [isNarrow]);

  return (
    <FullCalendar
      ref={calendarRef}
      plugins={[dayGridPlugin, interactionPlugin, listPlugin]}
      initialView={isNarrow ? "listWeek" : "dayGridMonth"}
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: isNarrow ? "" : "dayGridMonth,listWeek",
      }}
      height="auto"
      events={events}
      editable={true}
      eventDrop={onEventDrop}
      eventResizableFromStart={false}
    />
  );
}
