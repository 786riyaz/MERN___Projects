import { useEffect, useState } from "react";
import { getTasks, updateTaskStatus } from "../api/task.api";
import { socket } from "../socket/socket";
import { useAuth } from "../auth/AuthContext";
import { formatDateWithRelativeTime } from "../utils/time";

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
    getTasks().then(res => {
      setTasks(sortByLatest(res.data));
    });

    socket.connect();
    socket.emit("join", user!.id);

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
      {/* HEADER */}
      <div className="header">
        <h2>Welcome, {user?.username}</h2>

        <div style={{ display: "flex", gap: 12 }}>
          {/* 🔔 Notification Bell */}
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowNotifications(p => !p)}>
              🔔 {notifications.length}
            </button>

            {showNotifications && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: 40,
                  width: 280,
                  background: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: 6,
                  padding: 10,
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
                      marginBottom: 10,
                      borderBottom: "1px solid #eee",
                      paddingBottom: 6
                    }}
                  >
                    <strong>{n.task.title}</strong>
                    <div style={{ fontSize: 12 }}>
                      Assigned at{" "}
                      {formatDateWithRelativeTime(n.task.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button onClick={logout}>Logout</button>
        </div>
      </div>

      {/* TASK LIST */}
      {tasks.length === 0 && <p>No tasks assigned</p>}

      {tasks.map(task => (
        <div className="task" key={task._id}>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: "0 0 6px 0" }}>
              {task.title}
            </h4>

            <p style={{ margin: "0 0 6px 0", color: "#555" }}>
              {task.description}
            </p>

            <small style={{ color: "#777" }}>
              Created at:{" "}
              {formatDateWithRelativeTime(task.createdAt)}
            </small>

            <div style={{ marginTop: 6 }}>
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
