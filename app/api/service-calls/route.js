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
      sc.status,
      sc.scheduled_date,
      c.name AS customer_name
    FROM service_calls sc
    JOIN customers c ON c.id = sc.customer_id
    ORDER BY sc.scheduled_date ASC
  `,
    )
    .all();

  return NextResponse.json(rows);
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
export async function PUT(req) {
  const { id, scheduled_date } = await req.json();

  db.prepare(
    `
        UPDATE service_calls
        SET scheduled_date = ?
        WHERE id = ?
    `,
  ).run(scheduled_date, id);

  return NextResponse.json({ success: true });
}
