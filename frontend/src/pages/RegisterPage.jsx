import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import PasswordToggle from "../components/PasswordToggle";
import { useSound } from "../hooks/useSound";

export default function RegisterPage() {
  const navigate = useNavigate();
  const playClickSound = useSound();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const passwordsMismatch = form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    playClickSound();
    setErrorMessage("");

    if (form.password !== form.confirmPassword) {
      setErrorMessage("The two passwords must match before creating your account.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("http://localhost:4000/api/auth/register", {
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
        setErrorMessage(data.message || "Register failed. Please review your details and try again.");
        return;
      }

      navigate("/", {
        state: {
          successMessage: "Account created successfully. Sign in to continue."
        }
      });
    } catch (err) {
      setErrorMessage(err.message || "Unable to create your account right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout variant="register">
      <div className="auth-card auth-card-register fade-in-up">
        <div className="auth-card-header">
          <div className="auth-card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="auth-eyebrow">Task Manager</p>
          <h1 className="auth-card-title">Create account</h1>
          <p className="auth-card-subtitle">
            Start managing your tasks today
          </p>
        </div>

        {errorMessage && (
          <div className="auth-feedback error">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label className="auth-label" htmlFor="register-email">
              Email address
            </label>
            <input
              id="register-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              className="form-input"
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="register-password">
              Password
            </label>
            <div className="input-with-action">
              <input
                id="register-password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                className="form-input"
                autoComplete="new-password"
                required
              />
              <PasswordToggle
                isVisible={showPassword}
                label="password"
                onClick={() => { playClickSound(); setShowPassword((prev) => !prev); }}
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="register-confirm-password">
              Confirm password
            </label>
            <div className="input-with-action">
              <input
                id="register-confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="form-input"
                autoComplete="new-password"
                required
              />
              <PasswordToggle
                isVisible={showConfirmPassword}
                label="confirmation password"
                onClick={() => { playClickSound(); setShowConfirmPassword((prev) => !prev); }}
              />
            </div>
            {passwordsMismatch && (
              <p className="auth-inline-error">
                Passwords do not match yet.
              </p>
            )}
          </div>

          <div className="auth-submit">
            <button type="submit" className="btn-primary" disabled={isSubmitting || passwordsMismatch}>
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/" onClick={() => playClickSound()} className="auth-link">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
