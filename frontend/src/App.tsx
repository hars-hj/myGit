// src/App.tsx
import { Routes, Route } from "react-router-dom";

import {Login} from "./components/Auth/Login";
import {Signup} from "./components/Auth/Signup";
import {Profile} from "./components/User/profile";
import {Dashboard} from "./components/Dashboard/Dashboard";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";

export default function App() {
  return (
    <Routes>

      {/* Public routes */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>
      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

         <Route path="*" element={<Signup/>}></Route>

    </Routes>
  );
}
