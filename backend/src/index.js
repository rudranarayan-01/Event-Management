const express = require('express');
const cors = require('cors');
const setupDb = require('./database');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const cors = require("cors")

// CORS configuration for local and production
const allowedOrigins = ['http://localhost:5173', 'https://your-frontend.onrender.com'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) callback(null, true);
        else callback(new Error('Not allowed by CORS'));
    }
}));


app.use(express.json());

let db;
setupDb().then(database => db = database);

// --- ROUTES ---
app.get('/api/health', (req, res) => {
    res.json({ status: "Backend is running", timestamp: new Date() });
});

app.post('/api/users/sync', async (req, res) => {
    const { clerkId, fullName, email, profileImageUrl } = req.body;
    try {
        await db.run(
            `INSERT OR REPLACE INTO users (clerkId, fullName, email, profileImageUrl) 
             VALUES (?, ?, ?, ?)`,
            [clerkId, fullName, email, profileImageUrl]
        );
        res.status(200).json({ message: "User profile synchronized" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 1. Fetch ALL events (For Discovery/Home)
app.get('/api/events', async (req, res) => {
    try {
        // Fetch all events for the public grid
        const events = await db.all('SELECT * FROM events');
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fetch All the events for Dashboard
app.get('/api/manager/events/:managerId', async (req, res) => {
    const { managerId } = req.params;
    try {
        // This query counts registrations for each event automatically
        const events = await db.all(`
            SELECT 
                e.*, 
                COUNT(r.id) AS totalBookings 
            FROM events e
            LEFT JOIN registrations r ON e.id = r.eventId
            WHERE e.managerId = ?
            GROUP BY e.id
        `, [managerId]);
        
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create Event
app.post('/api/events', async (req, res) => {
    const { managerId, title, description, location, dateTime, privacy, silver, gold, diamond } = req.body;
    const id = uuidv4();
    await db.run(
        `INSERT INTO events (id, managerId, title, description, location, dateTime, privacy, silver_price, gold_price, diamond_price) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, managerId, title, description, location, dateTime, privacy, silver, gold, diamond]
    );
    res.status(201).json({ id, message: "Event Created" });
});

// Fetch Attendee List for specific Event
app.get('/api/events/:id/attendees', async (req, res) => {
    const { id } = req.params;
    const attendees = await db.all('SELECT * FROM registrations WHERE eventId = ?', [id]);
    res.json(attendees);
});

// Get Event Details for Booking Page
app.get('/api/events/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT 
                e.*,
                COUNT(r.id) AS totalAttendees,
                SUM(CASE 
                    WHEN r.ticketType = 'Silver' THEN e.silver_price 
                    WHEN r.ticketType = 'Gold' THEN e.gold_price 
                    WHEN r.ticketType = 'Diamond' THEN e.diamond_price 
                    ELSE 0 
                END) AS accumulatedRevenue
            FROM events e
            LEFT JOIN registrations r ON e.id = r.eventId
            WHERE e.id = ?
            GROUP BY e.id
        `;
        const event = await db.get(query, [id]);
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }
        // Handle null revenue for events with 0 bookings
        event.accumulatedRevenue = event.accumulatedRevenue || 0;
        res.json(event);
    } catch (err) {
        console.error("Database Error:", err.message);
        res.status(500).json({ error: "Failed to fetch event metrics" });
    }
});

// Update Event (For Manager's Control Panel)
app.put('/api/events/:id', async (req, res) => {
    const { title, location, description } = req.body;
    await db.run(
        'UPDATE events SET title = ?, location = ?, description = ? WHERE id = ?',
        [title, location, description, req.params.id]
    );
    res.json({ message: "Updated" });
});

// Registration Endpoint
app.post('/api/registrations', async (req, res) => {
    const { eventId, userId, userName, userEmail, ticketType, paymentStatus } = req.body;
    try {
        await db.run(
            `INSERT INTO registrations (eventId, userId, userName, userEmail, ticketType, paymentStatus) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [eventId, userId, userName, userEmail, ticketType, paymentStatus]
        );
        res.status(201).json({ message: "Registration Successful" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


//  Discussion Forum Endpoint
app.get('/api/events/:id/discussions', async (req, res) => {
    try {
        const posts = await db.all(
            `SELECT 
                d.id, 
                d.content, 
                d.timestamp, 
                u.fullName, 
                u.profileImageUrl 
             FROM engagement d 
             JOIN users u ON d.userId = u.clerkId 
             WHERE d.eventId = ? 
             ORDER BY d.timestamp ASC`, 
            [req.params.id]
        );
        res.json(posts);
    } catch (err) {
        console.error("SQL Error:", err.message);
        res.status(500).json({ error: "Could not fetch discussions" });
    }
});

// backend/src/index.js
app.post('/api/engagement', async (req, res) => {
    const { eventId, userId, type, content } = req.body;
    
    // Check if data is arriving
    console.log("📥 Received Message:", { eventId, userId, content });

    try {
        const result = await db.run(
            'INSERT INTO engagement (eventId, userId, type, content) VALUES (?, ?, ?, ?)',
            [eventId, userId, type, content]
        );
        res.status(201).json({ id: result.lastID, message: "Post shared" });
    } catch (err) {
        // This will print the EXACT reason (e.g., "FOREIGN KEY constraint failed")
        console.error("SQL ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
});


// nodemailer setup (for broadcasting messages to attendees)
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Broadcast Route
app.post('/api/events/:id/broadcast', async (req, res) => {
    const { id } = req.params;
    const { message, eventTitle } = req.body;

    try {
        // Fetch all registered emails for this event
        const attendees = await db.all('SELECT userEmail FROM registrations WHERE eventId = ?', [id]);
        const event = await db.get('SELECT * FROM events WHERE id = ?', [req.params.id]);
        const emailList = attendees.map(a => a.userEmail).join(',');

        if (!emailList) return res.status(404).json({ error: "No attendees found" });

        // Send the Email
        await transporter.sendMail({
            from: '"Event Manager" <your-email@gmail.com>',
            to: emailList, 
            subject: `Update for ${event.title}`,
            text: message,
            html: `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
                    <h2>${event.title}</h2>
                    <p>${message}</p>
                    <hr />
                    <small>Sent by your Event Organizer</small>
                   </div>`
        });

        res.json({ message: "Broadcast sent successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to send broadcast" });
    }
});

const PORT = process.env.PORT||5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));