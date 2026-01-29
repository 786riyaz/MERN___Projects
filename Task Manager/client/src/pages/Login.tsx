// client/src/pages/Login.tsx
import { useState } from "react";
import { loginApi } from "../api/auth.api";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const res = await loginApi({ username, password });
      login(res.data);

      res.data.user.role === "admin"
        ? navigate("/admin")
        : navigate("/user");
    } catch {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     ENTER KEY SUBMIT
  ====================== */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="container" style={{ maxWidth: 420 }}>
      {/* ================= HEADER ================= */}
      <div className="header">
        <h2>Login</h2>
        <ThemeToggle />
      </div>

      {/* ================= ERROR ================= */}
      {error && (
        <p
          style={{
            color: "var(--warning-text)",
            marginBottom: 12
          }}
        >
          {error}
        </p>
      )}

      {/* ================= FORM ================= */}
      <input
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
      />

      <button
        onClick={handleLogin}
        disabled={loading}
        style={{
          opacity: loading ? 0.7 : 1,
          cursor: loading ? "not-allowed" : "pointer"
        }}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
};

export default Login;
