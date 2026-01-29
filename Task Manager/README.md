# 🗂️ Task Management Application

A minimal yet **production-grade Task Management System** built using the **MERN stack with TypeScript and Socket.io**, featuring **JWT authentication**, **role-based access control (RBAC)**, **real-time notifications**, and **theme switching**.

This project was developed as part of a **practical interview assignment**, with a strong focus on **clean architecture, correctness, real-time behavior, and real-world patterns**, rather than heavy UI frameworks.

---

## 🚀 Tech Stack

### Backend

- Node.js
- Express.js
- TypeScript
- MongoDB (Mongoose)
- JWT Authentication
- Socket.io (real-time communication)

### Frontend

- React
- TypeScript
- Axios
- React Router
- Socket.io Client
- Context API
- Plain CSS (no UI libraries)
- Light / Dark Theme Switching

---

## 👥 Roles & Permissions

### 👨‍💼 Admin

- Login
- Create tasks (title + description)
- Assign tasks to users
- View all tasks
- View task creation time (absolute + relative)
- 🔔 Receive **real-time notifications** when:
  - A task is assigned (existing)
  - A user updates the status of any assigned task (new)

- Toggle Light / Dark theme (persisted across refresh)

### 👤 User

- Login
- View only assigned tasks
- Update task status (`todo | in-progress | done`)
- 🔔 Receive real-time notifications when a task is assigned
- View task details with timestamps
- Toggle Light / Dark theme (persisted across refresh)

---

## ✨ Features

- JWT-based authentication
- Role-based access control (RBAC)
- Task creation and assignment
- Task status updates
- 🔔 **Real-time notifications using Socket.io**
  - User notified when task is assigned
  - Admin notified when user updates task status

- Notification bell UI for both Admin and User
- Absolute + relative timestamps (auto-updated every minute)
- 🌗 Light / Dark theme switching
- Theme persistence using `localStorage`
- Smooth theme transitions
- Clean, readable, framework-free UI
- Empty-state handling (no tasks / no notifications)

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
│   │   ├── theme/
│   │   ├── utils/
│   │   └── App.tsx
│   └── index.css
│
├── .gitignore
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/786riyaz/Task-Management.git
cd Task-Management
```

---

### 2️⃣ Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` folder:

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

- `POST /api/auth/register`
- `POST /api/auth/login`

### Tasks

- `POST /api/task/tasks` – Admin only
- `GET /api/task/tasks`
- `PATCH /api/task/tasks/:id/status` – Assigned user only

### Users

- `GET /api/users` – Admin only

---

## 🔔 Real-Time Functionality (Socket.io)

### Server Emits

- `task:assigned`
  - When an admin assigns a task to a user

- `task:status-updated`
  - When a user updates the status of an assigned task (notifies admin)

### Client Behavior

- Notification bell updates instantly
- Task list updates live without page refresh
- Admin and User notifications are **room-based**, scoped by `userId`

---

## 🕒 Time Handling

- Tasks display both **absolute time** and **relative time**
- Example:

```
Created at: 27/01/2026, 03:58:16 PM (1 hour ago)
```

- Relative time auto-updates every minute using a single interval-based re-render
- Centralized time utility for consistency

---

## 🌗 Theme Switching

- Light and Dark theme support
- Global theme managed using Context API
- Theme preference persisted using `localStorage`
- Theme remains unchanged after:
  - Page refresh
  - Logout / Login

- Smooth 500ms CSS-based transitions
- Theme toggle available on:
  - Login page
  - Admin dashboard
  - User dashboard

---

## 🧠 Design Decisions

- Stateless JWT authentication for scalability
- RBAC enforced at middleware and query level
- Socket.io rooms keyed by `userId` for targeted notifications
- Admin notification logic reuses existing socket infrastructure
- Centralized time formatting utility
- Single interval approach for relative time updates
- Theme applied via CSS variables for performance
- Minimal UI to keep focus on logic and correctness

---

## 🧪 Testing

- APIs tested using Postman
- RBAC verified using Admin & User roles
- Socket.io events verified via UI behavior and browser console
- Theme persistence tested across refresh and logout/login cycles

---

## 👤 Author

GitHub: **786riyaz**

---

## ✅ Submission Status

This project satisfies **all requirements** of the practical interview assignment, including:

- Authentication & RBAC
- Real-time task assignment notifications
- Real-time admin notifications on task status updates
- Clean UI with theme switching
- Correct data handling and architecture

The project is **ready for evaluation**.

---

## 🚀 Future Improvements

- Mark notifications as read/unread
- Admin dashboard analytics

---

## 📸 Application Screenshots

> The following screenshots demonstrate the core functionality, role-based behavior, real-time notifications, and overall workflow of the application.

---

### 🔐 01. Login Page

![Login Page](UT/01%20Login.png)

---

### 👨‍💼 02. Dashboard

![Admin Dashboard](UT/02%20Dashboard.png)

---

### 📝 03. Admin Assigning Task to User 1

![Assigning Task to User 1](UT/03%20Assigning%20Task%20to%20User%201.png)

---

### 🔔 04. User 1 Receiving Task Assignment Notification

![User 1 Getting Notification](UT/04%20User1%20Getting%20Notification.png)

---

### 🔄 05. User 1 Updating Task Status

![User 1 Updating Task Status](UT/05%20User1%20Updating%20Task%20Status.png)

---

### 🔔 06. Admin Receiving Notification for Updated Task (User 1)

![Admin Getting Notification for Updated Task of User 1](UT/06%20Admin%20Getting%20Notification%20for%20Updated%20Task%20of%20User%201.png)

---

### 📝 07. Admin Assigning Task to User 2

![Assigning Task to User 2](UT/07%20Assigning%20Task%20to%20User%202.png)

---

### 🔔 08. Admin Receiving Notification for Updated Task (User 2)

![Admin Getting Notification for Updated Task of User 2](UT/08%20Admin%20Getting%20Notification%20for%20Updated%20Task%20of%20User%202.png)

---
