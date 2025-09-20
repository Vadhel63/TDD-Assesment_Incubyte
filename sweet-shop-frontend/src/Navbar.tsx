import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="bg-green-500 text-white p-4 flex justify-between items-center">
      <div className="font-bold text-xl">Sweet Shop</div>
      <div className="space-x-4">
        <Link to={role === "admin" ? "/dashboard/admin" : "/dashboard/user"} className="hover:underline">
          Dashboard
        </Link>
        {role === "admin" && <Link to="/manage-users" className="hover:underline">Manage Users</Link>}
        <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
