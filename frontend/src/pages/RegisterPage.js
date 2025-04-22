import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../authContext";
import { registerUser } from "../services/authService";

const Register = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const data = await registerUser(formData);
      setMessage(data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message || "An error occurred");
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
        background: "linear-gradient(135deg, #fdfbfb, #ebedee)",
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
        <h2 style={{ marginBottom: "1.5rem", color: "#1e3a8a" }}>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.2rem" }}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                padding: "0.8rem",
                width: "100%",
                borderRadius: "10px",
                border: "1px solid #ccc",
                outline: "none",
                transition: "border-color 0.3s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
              onBlur={(e) => (e.target.style.borderColor = "#ccc")}
            />
          </div>
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
                outline: "none",
                transition: "border-color 0.3s",
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
                outline: "none",
                transition: "border-color 0.3s",
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
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        {message && (
          <p style={{ color: "green", marginTop: "1rem", fontSize: "0.9rem" }}>
            {message}
          </p>
        )}
        {error && (
          <p style={{ color: "red", marginTop: "1rem", fontSize: "0.9rem" }}>
            {error}
          </p>
        )}
        <p style={{ marginTop: "1.5rem", fontSize: "0.9rem" }}>
          Already have an account?{" "}
          <a
            href="/login"
            style={{
              color: "#3b82f6",
              textDecoration: "none",
              fontWeight: "500",
            }}
            onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
