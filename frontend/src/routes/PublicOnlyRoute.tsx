
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function PublicOnlyRoute() {
  const { isAuthed, loading } = useAuth();

  if (loading) return null;

  return isAuthed ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
