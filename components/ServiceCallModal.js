"use client";

import { useState } from "react";

export default function ServiceCallModal({ open, onClose, onSave, customers }) {
  const [formData, setFormData] = useState({
    customer_id: "",
    title: "",
    scheduled_date: "",
    status: "Pending",
  });

  const [creatingCustomer, setCreatingCustomer] = useState(false);

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
  });

  if (!open) return null;

  const handleCustomerChange = (e) => {
    const value = e.target.value;

    if (value === "__new__") {
      setCreatingCustomer(true);
      setFormData((prev) => ({
        ...prev,
        customer_id: "",
      }));
      return;
    }

    setCreatingCustomer(false);

    setFormData((prev) => ({
      ...prev,
      customer_id: value,
    }));
  };

  const handleSubmit = () => {
    onSave({
      ...formData,
      createCustomer: creatingCustomer,
      newCustomer,
    });

    setFormData({
      customer_id: "",
      title: "",
      scheduled_date: "",
      status: "Pending",
    });

    setNewCustomer({
      name: "",
      phone: "",
      email: "",
    });

    setCreatingCustomer(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Create Service Call</h2>

        {/* Customer */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Customer</label>

          <select
            value={creatingCustomer ? "__new__" : formData.customer_id}
            onChange={handleCustomerChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select Customer...</option>

            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}

            <option value="__new__">➕ Create New Customer</option>
          </select>
        </div>

        {/* New Customer Fields */}
        {creatingCustomer && (
          <div className="border rounded-lg p-4 bg-gray-50 mb-4">
            <h3 className="font-medium mb-3">New Customer</h3>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Customer Name"
                value={newCustomer.name}
                onChange={(e) =>
                  setNewCustomer((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className="w-full border rounded px-3 py-2"
              />

              <input
                type="text"
                placeholder="Phone"
                value={newCustomer.phone}
                onChange={(e) =>
                  setNewCustomer((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
                className="w-full border rounded px-3 py-2"
              />

              <input
                type="email"
                placeholder="Email"
                value={newCustomer.email}
                onChange={(e) =>
                  setNewCustomer((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        )}

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Problem Description
          </label>

          <textarea
            rows={4}
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Status */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Status</label>

          <select
            value={formData.status}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                status: e.target.value,
              }))
            }
            className="w-full border rounded px-3 py-2"
          >
            <option value="Pending">Pending</option>

            <option value="Scheduled">Scheduled</option>

            <option value="Parts Ordered">Parts Ordered</option>

            <option value="Complete">Complete</option>
          </select>
        </div>

        {/* Date only if Scheduled */}
        {formData.status === "Scheduled" && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Scheduled Date
            </label>

            <input
              type="date"
              value={formData.scheduled_date}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  scheduled_date: e.target.value,
                }))
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Call
          </button>
        </div>
      </div>
    </div>
  );
}
