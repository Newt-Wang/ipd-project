import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    <div className="auth-bg px-4">
      <div className="auth-card fade-in-up">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4"
               style={{ background: "linear-gradient(135deg, #4F6EF7 0%, #7C3AED 100%)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="9" cy="7" r="4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Create account
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Start managing your tasks today
          </p>
        </div>

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

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Password
            </label>
            <div className="input-with-action">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                value={form.password}
                onChange={handleChange}
                className="form-input"
                autoComplete="new-password"
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

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Confirm password
            </label>
            <div className="input-with-action">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="form-input"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="input-action-button"
                onClick={() => { playClickSound(); setShowConfirmPassword((prev) => !prev); }}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
            {passwordsMismatch && (
              <p className="mt-1.5 text-sm" style={{ color: "var(--danger)" }}>
                Passwords do not match yet.
              </p>
            )}
          </div>

          <div className="pt-2">
            <button type="submit" className="btn-primary" disabled={isSubmitting || passwordsMismatch}>
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
          Already have an account?{" "}
          <a href="/" onClick={() => playClickSound()} className="font-semibold" style={{ color: "var(--brand-primary)" }}>
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
