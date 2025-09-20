import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ManageUsers from "./components/admin/ManageUsers";
const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/register" element={<RegisterForm />} />
    <Route path="/login" element={<LoginForm />} />

    {/* User Dashboard */}
    <Route
      path="/dashboard/user"
      element={
        <ProtectedRoute>
          <UserDashboard />
        </ProtectedRoute>
      }
    />

    {/* Admin Dashboard */}
    <Route
      path="/dashboard/admin"
      element={
        <ProtectedRoute >
          <AdminDashboard />
        </ProtectedRoute>
      }
      
    />
      <Route path="/admin/manage-users" element={<ManageUsers />} />

    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default AppRoutes;
