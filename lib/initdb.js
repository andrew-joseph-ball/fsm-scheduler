const sql = require("better-sqlite3");
const db = sql("app.db");

/*------------------------
    Create Tables
------------------------*/
db.prepare(
  `
    CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT, 
        email TEXT,
        address TEXT,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`,
).run();

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS service_calls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    customer_id INTEGER,
    scheduled_date TEXT,
    status TEXT,
    distributor TEXT,
    order_number TEXT,
    parts_ordered TEXT
  )
`,
).run();

console.log("Database initialized successfully.");
