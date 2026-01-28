import { useState } from "react";
import { loginApi } from "../api/auth.api";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await loginApi({ username, password });
      login(res.data);

      res.data.user.role === "admin"
        ? navigate("/admin")
        : navigate("/user");
    } catch {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="container" style={{ maxWidth: 400 }}>
      <h2>Login</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        placeholder="Username"
        onChange={e => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
