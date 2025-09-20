import React from "react";

const Dashboard = () => {
  const role = localStorage.getItem("role");
  return (
    <div className="p-6 max-w-2xl mx-auto text-center shadow-lg rounded-lg mt-10 bg-white">
      <h1 className="text-3xl font-bold mb-4">Dashboard Content</h1>
      <p className="text-lg">Welcome! Your role: <span className="font-semibold">{role}</span></p>
    </div>
  );
};

export default Dashboard;
