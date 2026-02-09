# Evently: Event Manager 
Evently is a full-stack web application designed to help people create, discover, and manage events. The goal was to build a clean, fast "Command Center" where event organizers can see exactly how their events are performing, while users get a smooth experience finding and booking tickets.

## Tech Stack:
I chose these specific tools because they work well together for a fast, modern app:

- Frontend: React with Vite (for speed) and Tailwind CSS (for the "Glassmorphism" look).
- Icons: Lucide-React for those sharp, consistent UI elements.
- Backend: Node.js and Express. It’s lightweight and handles many requests easily.
- Database: SQLite. I used this because it's a "file-based" database—perfect for a project like this where we want reliability without the overhead of a massive server.
- Auth: Clerk. This handles all the login/security stuff so I could focus on the actual event features.

## Key Features
### The Public Grid
    Users can see a list of all upcoming events. I wrote the code to automatically hide events that have already finished, so the platform always looks fresh and updated.

### The Manager Control Panel
This contains primary functionalities of the app. If we created an event, we get access to a special dashboard where we can:

- Track Revenue: It calculates how much money we’ve made from different ticket tiers (Diamond, Gold, Silver) using direct database math.

- Broadcast Emails: I built a custom email engine. If an organizer needs to update their guests, they can type one message, and it "dispatches" to everyone at once.

- Live Cleanup: Managers can delete events if plans change. I made sure that if an event is deleted, all the booking records for that event are wiped too, so the database stays clean.