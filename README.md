
📅 Climatiq Meeting Scheduler
A full-stack meeting scheduling application built for the Tese / Climatiq SWE Intern Assessment. This project allows users to book 15-minute slots across different timezones and provides an administrative interface for managing bookings.

🔗 Project Links
Live Demo: https://tese-meeting-scheduler-one.vercel.app/

Backend API: https://tese-meeting-scheduler-yz59.onrender.com

Loom Walkthrough: [Insert Loom Video Link Here]

🚀 Technical Stack
Frontend: React (Vite), TypeScript, TailwindCSS, Lucide-React.

Backend: Node.js, Express.js.

Database: MongoDB via Mongoose.

Utilities: date-fns, date-fns-tz (for timezone handling).

✨ Features
Core Functionality
Interactive Calendar: Custom-styled calendar that prevents booking on weekends or past dates.

Dynamic Slot Generation: Automatically calculates 15-minute intervals based on the selected date.

Timezone Conversion: Integrated timezone selector that adjusts available slots to the user's local time.

Responsive Design: Fully mobile-friendly UI following the Climatiq brand guidelines.

Bonus Features
Admin Dashboard: Accessible at /admin, providing a complete overview of all scheduled meetings.

Data Transformation: Backend logic to derive readable dates/times from UTC timestamps without database redundancy.

🛠️ Installation & Setup
Prerequisites
Node.js (v18 or higher)

MongoDB Atlas account or local MongoDB instance

1. Clone the Repository
Bash
git clone https://github.com/Nikhil2690/tese-meeting-scheduler

2. Backend Setup
Bash
cd backend
npm install
# Create a .env file and add:
# PORT=5000
# MONGODB_URI= mongodb+srv://nikhiladwani3_db_user:MFoOeCc9VhLBowI9@cluster0.srtlpb0.mongodb.net/?appName=Cluster0
npm run dev
3. Frontend Setup
Bash
cd frontend
npm install
# Create a .env file and add:
# VITE_API_BASE_URL=http://localhost:5000
npm run dev
🧠 Technical Decisions & Challenges
Timezone Handling
One of the core challenges was ensuring that a slot selected in GMT would display correctly for an admin in IST. I chose to:

Store all timestamps in the database as ISO UTC Strings.

Use date-fns-tz on the backend to dynamically shift these UTC times into the user’s requested timezone before sending them to the frontend.

AI-Assisted Workflow
In accordance with the assessment requirements, I utilized AI tools (Cursor/Copilot) for rapid prototyping and debugging. Detailed logs of these interactions, including prompt engineering and architectural refinements, can be found in PROMPT_LOG.md.