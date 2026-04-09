"use client";

import { useState, useMemo } from "react";
import { GripVertical } from "lucide-react";
import { useEffect, useRef } from "react";
import { Draggable } from "@fullcalendar/interaction";

function SidebarSection({ title, calls, color }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="border-b">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-4 py-3 font-semibold bg-gray-50 hover:bg-gray-100 transition"
      >
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${color}`}></span>
          {title}
          <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
            {calls.length}
          </span>
        </div>
        <span>{open ? "−" : "+"}</span>
      </button>

      <div
        className={`transition-all duration-300 overflow-hidden ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-3 space-y-2 max-h-72 overflow-y-auto">
          {calls.length === 0 && (
            <div className="text-sm text-gray-400">No jobs</div>
          )}

          {calls.map((call) => (
            <div
              key={call.id}
              className="draggable-item group cursor-move p-3 rounded-lg bg-white border shadow-sm hover:shadow-md hover:bg-gray-50 transition flex gap-2 items-start"
              data-id={call.id}
              data-title={call.customer_name}
            >
              <GripVertical
                size={16}
                className="text-gray-400 mt-0.5 group-hover:text-gray-600"
              />

              <div className="flex-1">
                <div className="font-medium text-sm">{call.customer_name}</div>
                <div className="text-xs text-gray-500 line-clamp-2">
                  {call.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function JobSidebar({ pendingCalls, partsOrderedCalls }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");

  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const draggable = new Draggable(containerRef.current, {
      itemSelector: ".draggable-item",
      eventData: (el) => ({
        id: el.dataset.id,
        title: el.dataset.title,
      }),
    });

    return () => {
      draggable.destroy();
    };
  }, [sidebarOpen, search, pendingCalls, partsOrderedCalls]);

  // 🔎 Filtered results
  const filteredPending = useMemo(() => {
    return pendingCalls.filter(
      (c) =>
        c.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        c.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [pendingCalls, search]);

  const filteredParts = useMemo(() => {
    return partsOrderedCalls.filter(
      (c) =>
        c.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        c.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [partsOrderedCalls, search]);

  return (
    <div
      ref={containerRef}
      className={`relative transition-all duration-300 ${
        sidebarOpen ? "w-80" : "w-12"
      } border-l bg-white shadow-lg flex flex-col`}
    >
      {sidebarOpen ? (
        <>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
            <h2 className="font-semibold text-gray-700">Jobs</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-sm text-blue-600 hover:underline"
            >
              Hide
            </button>
          </div>

          {/* Search */}
          <div className="p-3 border-b">
            <input
              type="text"
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          {/* Sections */}
          <SidebarSection
            title="Pending"
            calls={filteredPending}
            color="bg-gray-400"
          />

          <SidebarSection
            title="Parts Ordered"
            calls={filteredParts}
            color="bg-yellow-500"
          />
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rotate-90 text-sm font-medium text-blue-600"
          >
            ✚
          </button>
        </div>
      )}
    </div>
  );
}
