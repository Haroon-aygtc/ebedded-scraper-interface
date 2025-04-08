import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "../components/home";
import Dashboard from "../pages/admin/dashboard";
import LoginPage from "../pages/auth/login";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import ScrapingConfiguratorPage from "../pages/admin/scraping/configurator";
import SavedSelectorsPage from "../pages/admin/scraping/selectors";
import ScrapingHistoryPage from "../pages/admin/scraping/history";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      {/* Scraping Routes */}
      <Route
        path="/admin/scraping/configurator"
        element={
          <ProtectedRoute>
            <ScrapingConfiguratorPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/scraping/selectors"
        element={
          <ProtectedRoute>
            <SavedSelectorsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/scraping/history"
        element={
          <ProtectedRoute>
            <ScrapingHistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <Navigate to="/admin/dashboard" replace />
          </ProtectedRoute>
        }
      />
      {/* Add more routes as needed */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
