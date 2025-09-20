import React, { useEffect, useState } from "react";
import Navbar from "../../Navbar"

interface User {
  name: string;
  email: string;
  role: string;
}

const ManageUsers = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // For now, fetch from localStorage (later you can replace with backend API call)
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto mt-10 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">Manage Users</h1>

        {user ? (
          <div className="bg-gray-50 p-6 rounded-lg shadow-inner text-lg text-gray-700">
            <p className="mb-2">
              <span className="font-semibold">Name:</span> {user.name}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-semibold">Role:</span>{" "}
              <span className="capitalize">{user.role}</span>
            </p>
          </div>
        ) : (
          <p className="text-gray-500 text-center">No user info available</p>
        )}
      </div>
    </>
  );
};

export default ManageUsers;
