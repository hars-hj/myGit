// src/App.tsx
import { Routes, Route } from "react-router-dom";

import {Login} from "./components/Auth/Login";
import {Signup} from "./components/Auth/Signup";
import Profile from "./components/User/profile";
import {Dashboard} from "./components/Dashboard/Dashboard";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";
import CreateRepository from "./components/Repo/CreateReposetory";
import ViewRepo from "./components/Repo/ViewRepo";
import EditRepo from "./components/Repo/EditRepo";
import CreateIssue from "./components/Issue/issue";
import EditIssue from "./components/Issue/EditIssue";

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
         <Route path="/repos/new" element={<CreateRepository />} />
        <Route path="/repos/:repoId" element={<ViewRepo />} />
        <Route path="/repos/:repoId/edit" element={<EditRepo />} />
        <Route path="/repos/:repoId/issues/new" element={<CreateIssue />} />
        <Route path="/repos/:repoId/issues/:issueId/edit" element={<EditIssue />} />
      </Route>

         

    </Routes>
  );
}
