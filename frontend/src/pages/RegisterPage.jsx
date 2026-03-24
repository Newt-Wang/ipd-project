import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });

  // 输入框变化
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // 点击 Sign Up 触发
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Two passwords do not match!");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.email,
          email: form.email,
          password: form.password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Register failed");
        return;
      }

      alert("Register successful!");
      navigate("/login");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-white px-6">
      <h1 className="text-2xl font-bold mb-6">Create Account</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <input
          name="email"
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={handleChange}
          className="w-full border rounded-lg p-3 mb-4"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border rounded-lg p-3 mb-4"
        />

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm password"
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full border rounded-lg p-3 mb-6"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-bold"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
