import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import ExperimentMenu from "./pages/ExperimentMenu";

const techStack = [
  { name: "React", logo: reactLogo, url: "https://react.dev" },
  { name: "Vite", logo: viteLogo, url: "https://vite.dev" },
  { name: "TailwindCSS", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg", url: "https://tailwindcss.com/" },
  { name: "Chart.js", logo: "https://www.chartjs.org/img/chartjs-logo.svg", url: "https://www.chartjs.org/" },
  { name: "React Router", logo: "https://reactrouter.com/favicon-light.png", url: "https://reactrouter.com/" },
];

function Dashboard() {
  return <ExperimentMenu />;
}

function RequireAuth({ children }: { children: JSX.Element }) {
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
            <Dashboard />
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
