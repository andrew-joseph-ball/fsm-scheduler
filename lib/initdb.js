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
        customer_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        status TEXT DEFAULT 'Pending',
        scheduled_date TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id)
    )
`,
).run();

console.log("Database initialized successfully.");
