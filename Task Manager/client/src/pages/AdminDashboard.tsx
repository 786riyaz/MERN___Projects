import { useEffect, useState } from "react";
import { getTasks, createTask } from "../api/task.api";
import { getUsers } from "../api/user.api";
import { useAuth } from "../auth/AuthContext";
import UserSelect from "../components/UserSelect";
import { formatDateWithRelativeTime } from "../utils/time";

const AdminDashboard = () => {
  const { logout } = useAuth();

  const [tasks, setTasks] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedUser, setAssignedUser] = useState<any>(null);

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

  const handleCreate = async () => {
    if (!assignedUser) return alert("Select a user");

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
      <div className="header">
        <h2>Admin Dashboard</h2>
        <button onClick={logout}>Logout</button>
      </div>

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
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
      />

      <UserSelect
        users={users}
        onSelect={user => setAssignedUser(user)}
      />

      <button onClick={handleCreate}>Create Task</button>

      <h3 style={{ marginTop: 30 }}>All Tasks</h3>

      {tasks.length === 0 && (
        <p style={{ color: "#666" }}>No tasks created yet</p>
      )}

      {tasks.map(task => (
        <div className="task" key={task._id}>
          <div>
            <strong>{task.title}</strong>

            <p style={{ margin: "6px 0", color: "#555" }}>
              {task.description}
            </p>

            <small style={{ color: "#777" }}>
              Created at:{" "}
              {formatDateWithRelativeTime(task.createdAt)}
            </small>

            <div style={{ marginTop: 6 }}>
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
