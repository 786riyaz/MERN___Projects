Below is a **single, complete, copy-paste-ready `README.md`** file.
You can paste this **as-is** into your repository root and submit it.

---

# 🗂️ Task Management Application

A minimal **Task Management System** built using the **MERN stack with TypeScript and Socket.io**, featuring **JWT authentication**, **role-based access control (RBAC)**, and **real-time notifications**.

This project was developed as part of a **practical interview assignment**, focusing on clean architecture, correctness, and real-world patterns rather than UI frameworks.

---

## 🚀 Tech Stack

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB (Mongoose)
- JWT Authentication
- Socket.io

### Frontend
- React
- TypeScript
- Axios
- React Router
- Socket.io Client
- Plain CSS (no UI libraries)

---

## 👥 Roles & Permissions

### Admin
- Login
- Create tasks (title + description)
- Assign tasks to users
- View all tasks
- View task creation time (absolute + relative)

### User
- Login
- View only assigned tasks
- Update task status (`todo | in-progress | done`)
- Receive real-time notifications when a task is assigned
- View task details with timestamps

---

## ✨ Features

- JWT-based authentication
- Role-based access control (RBAC)
- Task creation with description
- Task status updates
- Real-time task assignment notifications (Socket.io)
- Notification bell UI
- Absolute + relative timestamps (auto-updated every minute)
- Clean and readable UI
- Empty-state handling (no tasks)

---

## 📁 Project Structure

```

root/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.ts
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── auth/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── socket/
│   │   ├── utils/
│   │   └── App.tsx
│   └── index.css
│
├── .gitignore
└── README.md

````

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/786riyaz/Task-Management.git
cd Task-Management
````

---

### 2️⃣ Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `backend` folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskdb
JWT_SECRET=your_jwt_secret
```

Start the backend server:

```bash
npm run dev
```

Backend runs at:

```
http://localhost:5000
```

---

### 3️⃣ Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## 🔐 API Overview

### Authentication

* `POST /api/auth/register`
* `POST /api/auth/login`

### Tasks

* `POST /api/task/tasks` – Admin only
* `GET /api/task/tasks`
* `PATCH /api/task/tasks/:id/status` – Assigned user only

### Users

* `GET /api/users` – Admin only

---

## 🔔 Real-Time Functionality (Socket.io)

### Server Emits

* `task:assigned` – When an admin assigns a task to a user

### Client Listens

* Notification bell updates instantly
* Task list updates without page refresh

---

## 🕒 Time Handling

* Tasks display **absolute time** and **relative time**
* Example:

  ```
  Created at: 27/01/2026, 03:58:16 PM (1 hour ago)
  ```
* Relative time auto-updates every minute using a single interval-based re-render

---

## 🧠 Design Decisions

* Stateless JWT authentication for scalability
* RBAC enforced at middleware and query level
* Socket rooms keyed by `userId` for targeted notifications
* Centralized time formatting utility
* Single interval approach for relative time updates
* Minimal UI to keep focus on logic and correctness

---

## 🧪 Testing

* APIs tested using Postman
* RBAC verified using Admin & User roles
* Socket.io events verified via UI and browser console

---

## 👤 Author

**Your Name**
GitHub: `786riyaz`

---

## ✅ Submission Status

This project satisfies all requirements of the practical interview assignment and is ready for evaluation.

---

## ✅ Future Improvement

Adding a new feature for admin dashboard where the admin can also receive the notification on the modification of any task status.
