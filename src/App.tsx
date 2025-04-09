import { Suspense } from "react";
import { Routes, Route, useRoutes } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import routes from "tempo-routes";
import AppRoutes from "@/routes";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "@/components/ui/error-boundary";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AuthProvider>
        <ErrorBoundary>
          <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}>
            <div className="app-container">
              {/* For the tempo routes */}
              {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}

              <Routes>
                {/* Add this before any catchall route */}
                {import.meta.env.VITE_TEMPO === "true" && (
                  <Route path="/tempobook/*" />
                )}

                {/* Your existing routes */}
                <Route path="/*" element={<AppRoutes />} />
              </Routes>
            </div>
          </Suspense>
          <Toaster />
        </ErrorBoundary>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
