import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Invalid");

      // Save token and role
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 to-blue-100 p-4">
      <form className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-4" onSubmit={handleSubmit}>
        <h2 className="text-3xl font-bold mb-4 text-center text-green-700">Login</h2>

        {/* Error message */}
        {error && (
          <div role="alert" className="text-red-600 font-medium text-center">
            {error}
          </div>
        )}

        <input
          aria-label="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
        />
        <input
          aria-label="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition duration-300 font-semibold"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Register link */}
        <p className="text-center text-gray-600 mt-2">
          Don’t have an account?{" "}
          <Link to="/register" className="text-green-500 font-medium hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
