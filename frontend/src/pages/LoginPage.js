import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../authContext";
import { loginUser } from "../services/authService";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await loginUser(formData);
      login({
        email: data.email,
        userId: data.userId,
        username: data.username,
      });
      navigate("/home");
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "400px",
          width: "100%",
          background: "#fff",
          padding: "2rem",
          borderRadius: "20px",
          boxShadow: "0 12px 30px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "1.5rem", color: "#1e3a8a" }}>Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.2rem" }}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                padding: "0.8rem",
                width: "100%",
                borderRadius: "10px",
                border: "1px solid #ccc",
                transition: "all 0.3s",
                outline: "none",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
              onBlur={(e) => (e.target.style.borderColor = "#ccc")}
            />
          </div>
          <div style={{ marginBottom: "1.2rem" }}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                padding: "0.8rem",
                width: "100%",
                borderRadius: "10px",
                border: "1px solid #ccc",
                transition: "all 0.3s",
                outline: "none",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
              onBlur={(e) => (e.target.style.borderColor = "#ccc")}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: "0.75rem 2rem",
              backgroundColor: "#3b82f6",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "1rem",
              width: "100%",
              transition: "all 0.3s ease-in-out",
              boxShadow: "0 4px 14px rgba(59, 130, 246, 0.3)",
            }}
            disabled={loading}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#2563eb")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#3b82f6")}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {error && (
          <p style={{ color: "red", marginTop: "1rem", fontSize: "0.9rem" }}>
            {error}
          </p>
        )}
        <p style={{ marginTop: "1.5rem", fontSize: "0.9rem" }}>
          Don't have an account?{" "}
          <a
            href="/register"
            style={{
              color: "#3b82f6",
              textDecoration: "none",
              fontWeight: "500",
            }}
            onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
