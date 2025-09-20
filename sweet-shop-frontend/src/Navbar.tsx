import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface User {
  name: string;
  email: string;
  role: string;
}

const Navbar = () => {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="bg-green-500 text-white p-4 flex justify-between items-center">
      <div className="font-bold text-xl">Sweet Shop</div>

      <div className="space-x-4 flex items-center">
        {/* Dashboard Link */}
        <Link
          to={role === "admin" ? "/dashboard/admin" : "/dashboard/user"}
          className="hover:underline"
        >
          Dashboard
        </Link>

        {/* If admin, show Manage Users content inline */}
        {role === "admin" && user && (
          <div className="bg-white text-green-700 px-3 py-1 rounded shadow-md">
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm">{user.email}</p>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
