import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import React from "react";
import ExperimentMenu from "./pages/ExperimentMenu";
import TopNav from "./components/TopNav";
import ExperimentScreen from "./pages/ExperimentScreen";
import ProtectedLayout from "./components/ProtectedLayout";

function Dashboard() {
  return (
    <>
      <TopNav />
      <div>
        <ExperimentMenu />
      </div>
    </>
  );
}

function RequireAuth({ children }: { children: React.ReactElement }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const location = useLocation();
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginWrapper />} />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/experiment/:id"
        element={
          <RequireAuth>
            <ProtectedLayout>
              <ExperimentScreen />
            </ProtectedLayout>
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function LoginWrapper() {
  // On successful login, set isLoggedIn in localStorage
  const navigate = useNavigate();
  return <Login onLogin={() => {
    localStorage.setItem("isLoggedIn", "true");
    navigate("/dashboard");
  }} />;
}
