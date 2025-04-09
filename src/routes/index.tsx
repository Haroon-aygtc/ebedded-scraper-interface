import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "../components/home";
import Dashboard from "../pages/admin/dashboard";
import LoginPage from "../pages/auth/login";
import RegisterPage from "../pages/auth/register";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import AdminRoute from "../components/auth/AdminRoute";

// Scraping pages
import ScrapingConfiguratorPage from "../pages/admin/scraping/configurator";
import SavedSelectorsPage from "../pages/admin/scraping/selectors";
import ScrapingHistoryPage from "../pages/admin/scraping/history";
import ScrapingProblemsPage from "../pages/admin/scraping/problems";
import ScrapingVisualizationPage from "../pages/admin/scraping/visualization";
import SettingsPage from "../pages/admin/settings";

// Import other admin components as they become available
// For now, we'll redirect to dashboard for missing components

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/signup" element={<Navigate to="/register" replace />} />

      {/* Admin Dashboard */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        }
      />

      {/* Widget Config */}
      <Route
        path="/admin/widget-config"
        element={
          <AdminRoute>
            <Navigate to="/admin/dashboard" state={{ activeTab: "widget" }} replace />
          </AdminRoute>
        }
      />

      {/* Context Rules Routes */}
      <Route
        path="/admin/context-rules"
        element={
          <AdminRoute>
            <Navigate to="/admin/dashboard" state={{ activeTab: "context" }} replace />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/context-rules/create"
        element={
          <AdminRoute>
            <Navigate to="/admin/dashboard" state={{ activeTab: "context", subTab: "rule-editor" }} replace />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/context-rules/manage"
        element={
          <AdminRoute>
            <Navigate to="/admin/dashboard" state={{ activeTab: "context", subTab: "rules-list" }} replace />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/context-rules/test"
        element={
          <AdminRoute>
            <Navigate to="/admin/dashboard" state={{ activeTab: "context", subTab: "test" }} replace />
          </AdminRoute>
        }
      />

      {/* Templates Routes */}
      <Route
        path="/admin/templates"
        element={
          <AdminRoute>
            <Navigate to="/admin/dashboard" state={{ activeTab: "templates" }} replace />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/templates/create"
        element={
          <AdminRoute>
            <Navigate to="/admin/dashboard" state={{ activeTab: "templates", subTab: "create" }} replace />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/templates/manage"
        element={
          <AdminRoute>
            <Navigate to="/admin/dashboard" state={{ activeTab: "templates", subTab: "all" }} replace />
          </AdminRoute>
        }
      />

      {/* Scraping Routes */}
      <Route
        path="/admin/scraping"
        element={
          <AdminRoute>
            <Navigate to="/admin/dashboard" state={{ activeTab: "scraping" }} replace />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/scraping/configurator"
        element={
          <AdminRoute>
            <Navigate to="/admin/dashboard" state={{ activeTab: "scraping", subTab: "configurator" }} replace />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/scraping/selectors"
        element={
          <AdminRoute>
            <Navigate to="/admin/dashboard" state={{ activeTab: "scraping", subTab: "selectors" }} replace />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/scraping/history"
        element={
          <AdminRoute>
            <Navigate to="/admin/dashboard" state={{ activeTab: "scraping", subTab: "history" }} replace />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/scraping/problems"
        element={
          <AdminRoute>
            <Navigate to="/admin/dashboard" state={{ activeTab: "scraping", subTab: "problems" }} replace />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/scraping/visualization"
        element={
          <AdminRoute>
            <Navigate to="/admin/dashboard" state={{ activeTab: "scraping", subTab: "visualization" }} replace />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/scraping/advanced"
        element={
          <AdminRoute>
            <Navigate to="/admin/dashboard" state={{ activeTab: "scraping", subTab: "advanced" }} replace />
          </AdminRoute>
        }
      />

      {/* Embed Code */}
      <Route
        path="/admin/embed-code"
        element={
          <AdminRoute>
            <Navigate to="/admin/dashboard" state={{ activeTab: "embed" }} replace />
          </AdminRoute>
        }
      />

      {/* Analytics */}
      <Route
        path="/admin/analytics"
        element={
          <AdminRoute>
            <Navigate to="/admin/dashboard" state={{ activeTab: "analytics" }} replace />
          </AdminRoute>
        }
      />

      {/* User Management */}
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <Navigate to="/admin/dashboard" state={{ activeTab: "users" }} replace />
          </AdminRoute>
        }
      />

      {/* Settings */}
      <Route
        path="/admin/settings"
        element={
          <AdminRoute>
            <SettingsPage />
          </AdminRoute>
        }
      />

      {/* Catch-all admin route */}
      <Route
        path="/admin/*"
        element={
          <AdminRoute>
            <Navigate to="/admin/dashboard" replace />
          </AdminRoute>
        }
      />

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
