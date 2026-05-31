import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import PasswordToggle from "../components/PasswordToggle";
import { useSound } from "../hooks/useSound";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const playClickSound = useSound();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(location.state?.successMessage || "");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    playClickSound();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.email,
          password: form.password
        })
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        setErrorMessage(data.message || "Login failed. Please check your email and password.");
        return;
      }

      localStorage.setItem("token", data.token);
      navigate("/home");
    } catch (err) {
      setErrorMessage(err.message || "Unable to sign in right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-card fade-in-up">
        <div className="auth-card-header">
          <div className="auth-card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="auth-eyebrow">Task Manager</p>
          <h1 className="auth-card-title">Welcome back</h1>
          <p className="auth-card-subtitle">
            Sign in to your Task Manager
          </p>
        </div>

        {successMessage && (
          <div className="auth-feedback success">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="auth-feedback error">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label className="auth-label" htmlFor="login-email">
              Email address
            </label>
            <input
              id="login-email"
              type="email"
              name="email"
              placeholder="you@example.com"
              className="form-input"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="login-password">
              Password
            </label>
            <div className="input-with-action">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                className="form-input"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
              <PasswordToggle
                isVisible={showPassword}
                label="password"
                onClick={() => { playClickSound(); setShowPassword((prev) => !prev); }}
              />
            </div>
          </div>

          <div className="auth-submit">
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register" onClick={() => playClickSound()} className="auth-link">
            Create one
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
