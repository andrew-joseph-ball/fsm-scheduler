"use client";

import { useEffect, useState } from "react";

const STATUS_OPTIONS = ["Pending", "Scheduled", "Parts Ordered", "Complete"];

export default function ServiceCallsPage() {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [newCall, setNewCall] = useState({
    title: "",
    customer_id: "",
    scheduled_date: "",
    status: "Scheduled",
  });

  // Load Service Calls
  const loadCalls = async () => {
    const res = await fetch("/api/service-calls", {
      cache: "no-store",
    });

    const data = await res.json();
    setCalls(data);
    setLoading(false);
  };

  // Load Customers
  const loadCustomers = async () => {
    const res = await fetch("/api/customers", {
      cache: "no-store",
    });

    const data = await res.json();
    setCustomers(data);
  };

  // Load Calls & Customers
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCalls();
    loadCustomers();
  }, []);

  // Add service call
  const addCall = async () => {
    const title = prompt("Service Call Title");
    if (!title) return;

    const customer_id = 1; // placeholder until customer selection is implemented
    const scheduled_date = new Date().toISOString().slice(0, 10);

    const res = await fetch("/api/service-calls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, customer_id, scheduled_date }),
    });

    if (res.ok) {
      await loadCalls();
    }
  };

  // Save New Calls
  const saveNewCall = async () => {
    if (!newCall.title || !newCall.customer_id) {
      alert("Title and customer are required");
      return;
    }

    const res = await fetch("/api/service-calls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCall),
    });

    if (!res.ok) {
      alert("Failed to create service call");
      return;
    }

    setNewCall({
      title: "",
      customer_id: "",
      scheduled_date: "",
      status: "Scheduled",
    });

    await loadCalls();
  };

  // Update status inline
  const updateStatus = async (id, status) => {
    await fetch("/api/service-calls", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });

    setCalls((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  if (loading) return <p>Loading service calls…</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Service Calls</h1>
        <button
          onClick={async () => {
            const name = prompt("Customer name");
            if (!name) return;

            const res = await fetch("/api/customers", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name }),
            });

            if (res.ok) {
              await loadCustomers();
            }
          }}
          className="bg-blue-600 text-white px-3 py-2 rounded"
        >
          + Create Customer
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Customer</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>

          <tbody>
            <tr className="bg-yellow-50">
              <td className="p-2 border">
                <select
                  value={newCall.customer_id}
                  onChange={(e) =>
                    setNewCall({
                      ...newCall,
                      customer_id: Number(e.target.value),
                    })
                  }
                  className="w-full border p-1"
                >
                  <option value="">Select customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </td>

              <td className="p-2 border">
                <input
                  value={newCall.title}
                  onChange={(e) =>
                    setNewCall({ ...newCall, title: e.target.value })
                  }
                  className="w-full border p-1"
                  placeholder="Problem description"
                />
              </td>

              <td className="p-2 border">
                <input
                  type="date"
                  value={newCall.scheduled_date}
                  onChange={(e) =>
                    setNewCall({
                      ...newCall,
                      scheduled_date: e.target.value,
                    })
                  }
                  className="w-full border p-1"
                />
              </td>

              <td className="p-2 border flex gap-2">
                <select
                  value={newCall.status}
                  onChange={(e) =>
                    setNewCall({
                      ...newCall,
                      status: e.target.value,
                    })
                  }
                  className="border p-1"
                >
                  <option>Pending</option>
                  <option>Scheduled</option>
                  <option>Parts Ordered</option>
                  <option>Complete</option>
                </select>

                <button
                  onClick={saveNewCall}
                  className="bg-blue-600 text-white px-3 rounded"
                >
                  Save
                </button>
              </td>
            </tr>

            {calls.map((call) => (
              <tr key={call.id}>
                <td className="p-2 border">{call.customer_name}</td>
                <td className="p-2 border">{call.title}</td>
                <td className="p-2 border">{call.scheduled_date}</td>
                <td className="p-2 border">
                  <select
                    value={call.status}
                    onChange={(e) => updateStatus(call.id, e.target.value)}
                    className="border rounded p-1"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
