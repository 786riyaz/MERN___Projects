// client/src/pages/AdminDashboard.tsx
import { useEffect, useState } from "react";
import { getTasks, createTask } from "../api/task.api";
import { getUsers } from "../api/user.api";
import { useAuth } from "../auth/AuthContext";
import UserSelect from "../components/UserSelect";
import { formatDateWithRelativeTime } from "../utils/time";
import ThemeToggle from "../components/ThemeToggle";
import { socket } from "../socket/socket";

interface Notification {
  message: string;
  task: any;
}

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  const [tasks, setTasks] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedUser, setAssignedUser] = useState<any | null>(null);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  /* ======================
     LOAD DATA
  ====================== */
  const loadData = async () => {
    const [tasksRes, usersRes] = await Promise.all([
      getTasks(),
      getUsers()
    ]);

    setTasks(tasksRes.data);
    setUsers(usersRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ======================
     SOCKET: ADMIN JOIN
  ====================== */
  useEffect(() => {
    if (!user) return;

    socket.connect();
    socket.emit("join", user.id);

    socket.on("task:status-updated", data => {
      setNotifications(prev => [data, ...prev]);

      // update task list status live
      setTasks(prev =>
        prev.map(t =>
          t._id === data.task._id
            ? { ...t, status: data.task.status }
            : t
        )
      );
    });

    return () => {
      socket.off("task:status-updated");
      socket.disconnect();
    };
  }, [user]);

  /* ======================
     CREATE TASK
  ====================== */
  const handleCreate = async () => {
    if (!assignedUser) {
      alert("Select a user");
      return;
    }

    await createTask({
      title,
      description,
      assignedTo: assignedUser._id
    });

    setTitle("");
    setDescription("");
    setAssignedUser(null);

    loadData();
  };

  return (
    <div className="container">
      {/* ================= HEADER ================= */}
      <div className="header">
        <h2>Admin Dashboard</h2>

        <div style={{ display: "flex", gap: 12 }}>
          {/* 🔔 Admin Notifications */}
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowNotifications(p => !p)}>
              🔔 {notifications.length}
            </button>

            {showNotifications && (
              <div
                className="popup"
                style={{
                  position: "absolute",
                  right: 0,
                  top: 42,
                  width: 320,
                  padding: 12,
                  zIndex: 20
                }}
              >
                {notifications.length === 0 && (
                  <p>No notifications</p>
                )}

                {notifications.map((n, i) => (
                  <div
                    key={i}
                    style={{
                      borderBottom:
                        "1px solid var(--border)",
                      paddingBottom: 8,
                      marginBottom: 8
                    }}
                  >
                    <strong>{n.task.title}</strong>
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--muted)"
                      }}
                    >
                      Status updated to{" "}
                      <b>{n.task.status}</b>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <ThemeToggle />
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      {/* ================= CREATE TASK ================= */}
      <h3>Create Task</h3>

      <input
        placeholder="Task title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Task description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <UserSelect
        users={users}
        value={assignedUser}
        onSelect={user => setAssignedUser(user)}
      />

      <button onClick={handleCreate}>Create Task</button>

      {/* ================= TASK LIST ================= */}
      <h3 style={{ marginTop: 30 }}>All Tasks</h3>

      {tasks.length === 0 && (
        <p style={{ color: "var(--muted)" }}>
          No tasks created yet
        </p>
      )}

      {tasks.map(task => (
        <div className="task" key={task._id}>
          <div>
            <strong>{task.title}</strong>
            <p style={{ color: "var(--muted)" }}>
              {task.description}
            </p>
            <small style={{ color: "var(--muted)" }}>
              {formatDateWithRelativeTime(task.createdAt)}
            </small>
            <div>
              Assigned to: {task.assignedTo?.username}
            </div>
          </div>

          <span className={`badge ${task.status}`}>
            {task.status}
          </span>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
