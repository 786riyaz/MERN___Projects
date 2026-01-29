// client/src/pages/UserDashboard.tsx
import { useEffect, useState } from "react";
import { getTasks, updateTaskStatus } from "../api/task.api";
import { socket } from "../socket/socket";
import { useAuth } from "../auth/AuthContext";
import { formatDateWithRelativeTime } from "../utils/time";
import ThemeToggle from "../components/ThemeToggle";

/* ======================
   TYPES
====================== */
interface Task {
  _id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  createdAt: string;
}

interface Notification {
  message: string;
  task: Task;
}

/* ======================
   HELPERS
====================== */
const sortByLatest = (tasks: Task[]) =>
  [...tasks].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  );

const UserDashboard = () => {
  const { user, logout } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // 🔁 force re-render every minute (relative time update)
  const [, forceUpdate] = useState(0);

  /* ======================
     RELATIVE TIME TICK
  ====================== */
  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate(v => v + 1);
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  /* ======================
     INITIAL LOAD + SOCKET
  ====================== */
  useEffect(() => {
    if (!user) return;

    getTasks().then(res => {
      setTasks(sortByLatest(res.data));
    });

    socket.connect();
    socket.emit("join", user.id);

    socket.on("task:assigned", (data: Notification) => {
      setNotifications(prev => [data, ...prev]);

      setTasks(prev => {
        const exists = prev.some(t => t._id === data.task._id);
        if (exists) return prev;
        return sortByLatest([data.task, ...prev]);
      });
    });

    return () => {
      socket.off("task:assigned");
      socket.disconnect();
    };
  }, [user]);

  /* ======================
     UPDATE TASK STATUS
  ====================== */
  const handleStatusChange = async (
    taskId: string,
    status: Task["status"]
  ) => {
    await updateTaskStatus(taskId, status);

    setTasks(prev =>
      sortByLatest(
        prev.map(t =>
          t._id === taskId ? { ...t, status } : t
        )
      )
    );
  };

  return (
    <div className="container">
      {/* ================= HEADER ================= */}
      <div className="header">
        <h2>Welcome, {user?.username}</h2>

        <div style={{ display: "flex", gap: 12 }}>
          {/* 🔔 Notifications */}
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
                  width: 280,
                  padding: 12,
                  zIndex: 20
                }}
              >
                {notifications.length === 0 && (
                  <p style={{ margin: 0 }}>No notifications</p>
                )}

                {notifications.map((n, i) => (
                  <div
                    key={i}
                    style={{
                      marginBottom: 10,
                      paddingBottom: 6,
                      borderBottom: "1px solid var(--border)"
                    }}
                  >
                    <strong>{n.task.title}</strong>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>
                      Assigned{" "}
                      {formatDateWithRelativeTime(
                        n.task.createdAt
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 🌗 Theme Switch */}
          <ThemeToggle />

          {/* 🚪 Logout */}
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      {/* ================= TASK LIST ================= */}
      {tasks.length === 0 && (
        <p style={{ color: "var(--muted)" }}>
          No tasks assigned
        </p>
      )}

      {tasks.map(task => (
        <div className="task" key={task._id}>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: "0 0 6px 0" }}>
              {task.title}
            </h4>

            <p style={{ margin: "0 0 6px 0", color: "var(--muted)" }}>
              {task.description}
            </p>

            <small style={{ color: "var(--muted)" }}>
              Created at{" "}
              {formatDateWithRelativeTime(task.createdAt)}
            </small>

            <div style={{ marginTop: 8 }}>
              <span className={`badge ${task.status}`}>
                {task.status}
              </span>
            </div>
          </div>

          <select
            style={{ width: 160 }}
            value={task.status}
            onChange={e =>
              handleStatusChange(
                task._id,
                e.target.value as Task["status"]
              )
            }
          >
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      ))}
    </div>
  );
};

export default UserDashboard;
