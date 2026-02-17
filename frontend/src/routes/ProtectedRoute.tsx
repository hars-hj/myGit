
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../AuthContext";

const ProtectedRoute: React.FC = () => {
  const { isAuthed, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  return isAuthed ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
