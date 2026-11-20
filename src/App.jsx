import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { ProjectDetailsPage } from "./pages/ProjectDetailsPage";
import { LoginPage } from "./pages/admin/LoginPage";
import { DashboardPage } from "./pages/admin/DashboardPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProtectedRoute } from "./components/common/ProtectedRoute";

function App() {
  const navigate = useNavigate();

  // Secret shortcut: Ctrl + Shift + A opens the admin portal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        navigate("/rasheed-portal");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/projects/:id" element={<ProjectDetailsPage />} />
      <Route path="/rasheed-portal/login" element={<LoginPage />} />

      {/* Protected Admin Route */}
      <Route
        path="/rasheed-portal/*"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* 404 Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
