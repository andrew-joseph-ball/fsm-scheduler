"use client";

import { useEffect, useState } from "react";
import ServiceCallModal from "@/components/ServiceCallModal";

const STATUS_OPTIONS = ["Pending", "Scheduled", "Parts Ordered", "Complete"];

export default function ServiceCallsPage() {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ACTIVE");

  const getFilterCount = (filter) => {
    switch (filter) {
      case "ACTIVE":
        return calls.filter(
          (c) =>
            c.status === "Pending" ||
            c.status === "Scheduled" ||
            c.status === "Parts Ordered",
        ).length;

      case "ALL":
        return calls.length;

      default:
        return calls.filter((c) => c.status === filter).length;
    }
  };

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

  // Save New Calls

  // Update status inline
  const updateStatus = async (id, status) => {
    await fetch("/api/service-calls", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });

    setCalls((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  const updateCall = async (id, updates) => {
    await fetch("/api/service-calls", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    });

    loadCalls();
  };

  const handleCreateCall = async (data) => {
    try {
      let customerId = data.customer_id;

      if (data.createCustomer) {
        const customerRes = await fetch("/api/customers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data.newCustomer),
        });

        if (!customerRes.ok) {
          alert("Failed to create customer");
          return;
        }

        const customer = await customerRes.json();

        customerId = customer.id;
      }

      const callRes = await fetch("/api/service-calls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_id: customerId,
          title: data.title,
          scheduled_date:
            data.status === "Scheduled" ? data.scheduled_date : null,
          status: data.status,
        }),
      });

      if (!callRes.ok) {
        alert("Failed to create service call");
        return;
      }

      await loadCalls();
      await loadCustomers();

      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Error creating service call");
    }
  };

  const filteredCalls = calls.filter((call) => {
    switch (statusFilter) {
      case "ACTIVE":
        return call.status !== "Complete";

      case "ALL":
        return true;

      default:
        return call.status === statusFilter;
    }
  });

  if (loading) return <p>Loading service calls…</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Service Calls</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + New Service Call
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            "ALL",
            "ACTIVE",
            "Pending",
            "Scheduled",
            "Parts Ordered",
            "Complete",
          ].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1 rounded transition ${
                statusFilter === filter
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {filter}
              <span className="ml-2 text-xs">({getFilterCount(filter)})</span>
            </button>
          ))}
        </div>
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
            {filteredCalls.map((call) => (
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
      <ServiceCallModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleCreateCall}
        customers={customers}
      />
    </div>
  );
}
