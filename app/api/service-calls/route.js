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

  if (!title || !customer_id || !scheduled_date || !status) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const result = db
    .prepare(
      `
    INSERT INTO service_calls
      (title, customer_id, scheduled_date, status)
    VALUES (?, ?, ?, ?)
  `,
    )
    .run(title, customer_id, scheduled_date, status);

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
// app/api/service-calls/route.js

export async function PUT(req) {
  const body = await req.json();

  const {
    id,
    scheduled_date,
    status,
    distributor,
    order_number,
    parts_ordered,
  } = body;

  if (!id) {
    return new Response("Missing ID", { status: 400 });
  }

  db.prepare(
    `
  UPDATE service_calls
  SET
    distributor = COALESCE(?, distributor),
    order_number = COALESCE(?, order_number),
    parts_ordered = COALESCE(?, parts_ordered)
  WHERE id = ?
`,
  ).run(distributor, order_number, parts_ordered, id);

  return Response.json({ success: true });
}
