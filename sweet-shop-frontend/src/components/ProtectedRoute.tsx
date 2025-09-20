import React, { type JSX } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly }: { children: JSX.Element; adminOnly?: boolean }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;
  if (adminOnly && role !== "admin") return <Navigate to="/dashboard/user" replace />;

  return children;
};

export default ProtectedRoute;
