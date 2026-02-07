const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require('path');

async function setupDb() {

    // DB persistant
    const isProduction = process.env.NODE_ENV === "production";
    const dbPath = isProduction
        ? "/var/data/events.db" // This matches the Render Mount Path
        : path.join(__dirname, "events.db"); // Local development
    db = await open({
        filename: dbPath,
        driver: sqlite3.Database,
    });

    // 1. Users Table (Essential for Joins mainly for Conversation and all)
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            clerkId TEXT PRIMARY KEY,
            fullName TEXT,
            email TEXT,
            profileImageUrl TEXT
        )
    `);

  // 2. Events Table
  await db.exec(`
        CREATE TABLE IF NOT EXISTS events (
            id TEXT PRIMARY KEY,
            managerId TEXT,
            title TEXT,
            description TEXT,
            location TEXT,
            dateTime TEXT,
            privacy TEXT,
            silver_price INTEGER,
            gold_price INTEGER,
            diamond_price INTEGER
        )
    `);

  // 3. Create Registrations Table
  await db.exec(`
        CREATE TABLE IF NOT EXISTS registrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            eventId TEXT,
            userId TEXT,
            userName TEXT,
            userEmail TEXT,
            ticketType TEXT,
            paymentStatus TEXT,
            FOREIGN KEY (eventId) REFERENCES events (id),
            FOREIGN KEY (userId) REFERENCES users (clerkId)
        )
    `);

  // 4. Create Engagement Table
  await db.exec(`
        CREATE TABLE IF NOT EXISTS engagement (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            eventId TEXT,
            userId TEXT,
            type TEXT, 
            content TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (eventId) REFERENCES events (id),
            FOREIGN KEY (userId) REFERENCES users (clerkId)
        )
    `);

  console.log(`📡 Database connected at: ${dbPath}`);
  return db;
}

module.exports = setupDb;
