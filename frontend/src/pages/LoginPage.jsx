import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:4000/api/auth/login", {
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
      return alert(data.message || "Login failed");
    }

    localStorage.setItem("token", data.token);
    alert("Login successful!");

    navigate("/tasks");
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen px-6">
      <h1 className="text-2xl font-bold mb-6">Task Manager</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <input
          type="email"
          name="email"
          placeholder="Email address"
          className="w-full p-3 border rounded mb-4"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-3 border rounded mb-4"
          value={form.password}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold p-3 rounded"
        >
          Log In
        </button>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <a 
              href="/register" 
              className="text-blue-500 hover:underline"
            >
              Register here
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
