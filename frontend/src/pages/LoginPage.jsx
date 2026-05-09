import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
    <div className="auth-bg px-4">
      <div className="auth-card fade-in-up">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4"
               style={{ background: "linear-gradient(135deg, #4F6EF7 0%, #7C3AED 100%)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 11l3 3L22 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Welcome back
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Email address
            </label>
            <input
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

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Password
            </label>
            <div className="input-with-action">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                className="form-input"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="input-action-button"
                onClick={() => { playClickSound(); setShowPassword((prev) => !prev); }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
          Don't have an account?{" "}
          <a href="/register" onClick={() => playClickSound()} className="font-semibold" style={{ color: "var(--brand-primary)" }}>
            Create one
          </a>
        </p>
      </div>
    </div>
  );
}
