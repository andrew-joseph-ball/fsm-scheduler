import { NextResponse } from "next/server";
import db from "@/lib/db";

/* -------------------------------
   GET – list customers
-------------------------------- */
export async function GET() {
  const rows = db
    .prepare(
      `
    SELECT id, name
    FROM customers
    ORDER BY name ASC
  `,
    )
    .all();

  return NextResponse.json(rows);
}

/* -------------------------------
   POST – create customer
-------------------------------- */
export async function POST(req) {
  const { name } = await req.json();

  if (!name) {
    return NextResponse.json(
      { error: "Customer name required" },
      { status: 400 },
    );
  }

  const result = db
    .prepare(
      `
    INSERT INTO customers (name)
    VALUES (?)
  `,
    )
    .run(name);

  return NextResponse.json({
    id: result.lastInsertRowid,
  });
}
