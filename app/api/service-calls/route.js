import { NextResponse } from "next/server";
import db from "@/lib/db";

// GET /api/service-calls
export async function GET() {
  const rows = db
    .prepare(
      `
    SELECT
      sc.id,
      sc.title,
      sc.scheduled_date,
      sc.status,
      sc.distributor,
      sc.order_number,
      sc.parts_ordered,
      c.name AS customer_name
    FROM service_calls sc
    LEFT JOIN customers c ON sc.customer_id = c.id
    ORDER BY sc.scheduled_date
  `,
    )
    .all();

  return Response.json(rows);
}

// POST -- create new service call
export async function POST(req) {
  const { title, customer_id, scheduled_date, status } = await req.json();

  if (!title || !customer_id) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const result = db
    .prepare(
      `
  INSERT INTO service_calls (
    title,
    customer_id,
    scheduled_date,
    status,
    distributor,
    order_number,
    parts_ordered
  )
  VALUES (?, ?, ?, ?, '', '', '')
`,
    )
    .run(title, customer_id, scheduled_date || null, status || "Pending");

  return NextResponse.json({
    id: result.lastInsertRowid,
  });
}

// PATCH -- update status only
export async function PATCH(req) {
  const { id, status } = await req.json();

  db.prepare(
    `
      UPDATE service_calls
      SET status = ?
      WHERE id = ?`,
  ).run(status, id);

  return NextResponse.json({ success: true });
}

// PUT /api/service-calls
export async function PUT(req) {
  const body = await req.json();
  const { id } = body;

  if (!id) {
    return new Response("Missing ID", { status: 400 });
  }

  const fields = [];
  const values = [];

  if ("scheduled_date" in body) {
    fields.push("scheduled_date = ?");
    values.push(body.scheduled_date);
  }

  if ("status" in body) {
    fields.push("status = ?");
    values.push(body.status);
  }

  if ("distributor" in body) {
    fields.push("distributor = ?");
    values.push(body.distributor);
  }

  if ("order_number" in body) {
    fields.push("order_number = ?");
    values.push(body.order_number);
  }

  if ("parts_ordered" in body) {
    fields.push("parts_ordered = ?");
    values.push(body.parts_ordered);
  }

  if (fields.length === 0) {
    return Response.json({ success: true });
  }

  db.prepare(
    `
    UPDATE service_calls
    SET ${fields.join(", ")}
    WHERE id = ?
  `,
  ).run(...values, id);

  return Response.json({ success: true });
}
