import React from "react";
import Navbar from "../Navbar"

const UserDashboard = () => {
  return (
    <>
      <Navbar />
      <div className="p-6 max-w-2xl mx-auto text-center shadow-lg rounded-lg mt-10 bg-white">
        <h1 className="text-3xl font-bold mb-4">User Dashboard</h1>
        <p className="text-lg">Welcome! You are logged in as <span className="font-semibold">User</span></p>
      </div>
    </>
  );
};

export default UserDashboard;
