# job-tracker-app
# 💼 Tech Application Board (Full-Stack Kanban Tracker)

A responsive full-stack application designed to organize and track job applications across customizable pipeline stages (**Wishlist**, **Applied**, **Interview**, **Offer**, and **Rejected**).

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/Frontend-React%20%7C%20Vite-61DAFB?logo=react)
![Node](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?logo=node.js)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%20%7C%20Neon-4169E1?logo=postgresql)
![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma)

---

## 🚀 Live Demo

* **Web Application:** [job-tracker-app-tau-puce.vercel.app](https://job-tracker-app-tau-puce.vercel.app)
* **REST API Status:** [job-tracker-app-api.onrender.com/api/jobs](https://job-tracker-app-api.onrender.com/api/jobs)

---

## ✨ Features & Architecture

* **Interactive Kanban Board:** Drag-and-drop or status selector state updates.
* **Full CRUD Operations:** Add, update, filter, and delete job applications in real time.
* **Serverless Connection Pooling:** Neon PostgreSQL integration with pooling (`-pooler`) for low-latency queries.
* **Decoupled Architecture:** React (Vite) frontend on Vercel paired with a Node/Express API on Render.

---

## 🛠️ Local Setup

```bash
# 1. Clone repo
git clone [https://github.com/PatrickLoughran/job-tracker-app.git](https://github.com/PatrickLoughran/job-tracker-app.git)
cd job-tracker-app

# 2. Start Backend (in /server)
cd server
npm install
# Add DATABASE_URL to server/.env
npx prisma db push
npm run dev

# 3. Start Frontend (in /client)
cd ../client
npm install
# Add VITE_API_URL=http://localhost:5000 to client/.env
npm run dev

Method,  Endpoint,       Description
GET,     /api/jobs,      Fetch all job applications
POST,    /api/jobs,      Create a new job listing
PATCH,   /api/jobs/:id,  Update job status or info
DELETE,  /api/jobs/:id,  Remove a job listing

📄 License
Distributed under the MIT License.
