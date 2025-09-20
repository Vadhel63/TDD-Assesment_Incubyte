import React from "react";
import Navbar from "../Navbar";

const AdminDashboard = () => {
  return (
    <>
      <Navbar />
      <div className="p-6 max-w-2xl mx-auto text-center shadow-lg rounded-lg mt-10 bg-white">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-lg">Welcome! You are logged in as <span className="font-semibold">Admin</span></p>
      </div>
    </>
  );
};

export default AdminDashboard;
