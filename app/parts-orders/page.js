/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";

export default function PartsOrdersPage() {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPartsOrders = async () => {
    const res = await fetch("/api/service-calls", {
      cache: "no-store",
    });

    const data = await res.json();

    const filtered = data.filter((call) => call.status === "Parts Ordered");

    setCalls(filtered);
    setLoading(false);
  };

  useEffect(() => {
    loadPartsOrders();
  }, []);

  const updateField = async (id, field, value) => {
    await fetch("/api/service-calls", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        [field]: value,
      }),
    });

    loadPartsOrders();
  };

  if (loading) {
    return <p>Loading parts orders…</p>;
  }

  return (
    <div className="bg-white rounded shadow p-4">
      <h1 className="text-xl font-bold mb-4">Parts Orders</h1>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b text-left">
            <th className="p-2">Customer</th>
            <th className="p-2">Distributor</th>
            <th className="p-2">Order #</th>
            <th className="p-2">Parts Ordered</th>
          </tr>
        </thead>

        <tbody>
          {calls.map((call) => (
            <tr key={call.id} className="border-b">
              <td className="p-2 font-medium">{call.customer_name}</td>

              <td className="p-2">
                <input
                  className="w-full border rounded px-2 py-1"
                  defaultValue={call.distributor ?? ""}
                  onBlur={(e) =>
                    updateField(call.id, "distributor", e.target.value)
                  }
                />
              </td>

              <td className="p-2">
                <input
                  className="w-full border rounded px-2 py-1"
                  defaultValue={call.order_number ?? ""}
                  onBlur={(e) =>
                    updateField(call.id, "order_number", e.target.value)
                  }
                />
              </td>

              <td className="p-2">
                <textarea
                  className="w-full border rounded px-2 py-1"
                  rows={2}
                  defaultValue={call.parts_ordered ?? ""}
                  onBlur={(e) =>
                    updateField(call.id, "parts_ordered", e.target.value)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
