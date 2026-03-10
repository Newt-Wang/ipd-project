import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Password reset link sent to: " + email);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white px-6 pt-10">
      {/* 返回按钮 */}
      <button onClick={() => navigate(-1)} className="text-2xl mb-6">
        ←
      </button>

      {/* 标题 */}
      <h1 className="text-2xl font-semibold text-center mb-2">Forgot Password</h1>
      <p className="text-center text-gray-500 mb-8">
        Enter your email to reset your password.
      </p>

      {/* 表单 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="email"
          placeholder="Email address"
          className="w-full border rounded-xl px-4 py-3 text-gray-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-xl text-lg font-medium"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}
