import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !role) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Registration failed");

      // Navigate to login on success
      navigate("/login");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 to-blue-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-4"
      >
        <h2 className="text-3xl font-bold mb-4 text-center text-green-700">
          Register
        </h2>

        {/* Error message */}
        {error && (
          <div role="alert" className="text-red-600 font-medium text-center">
            {error}
          </div>
        )}

        <input
          aria-label="name"
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
        />
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
        <select
          aria-label="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition duration-300 font-semibold"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {/* Already registered link */}
        <p className="text-center text-gray-600 mt-2">
          Already registered?{" "}
          <Link
            to="/login"
            className="text-green-500 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
