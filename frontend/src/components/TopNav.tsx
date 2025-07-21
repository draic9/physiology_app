import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SunIcon, MoonIcon, UserCircleIcon, ArrowRightOnRectangleIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

export default function TopNav() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    }
    if (accountOpen) {
      document.addEventListener("mousedown", handleClick);
    } else {
      document.removeEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [accountOpen]);

  function handleLogout() {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/dashboard" className="flex items-center gap-2 font-extrabold text-emerald-600 dark:text-emerald-300 text-xl hover:opacity-80 transition">
            <span>Physiologi</span>
          </Link>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Navigation Links */}
          <Link to="/dashboard" className="hidden sm:inline px-3 py-2 rounded text-gray-700 dark:text-gray-200 font-medium hover:bg-emerald-100 dark:hover:bg-emerald-800 transition">
            Experiments
          </Link>
          {/* Account Dropdown */}
          <div className="relative" ref={accountRef}>
            <button
              className="flex items-center gap-1 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              onClick={() => setAccountOpen((o) => !o)}
              aria-label="Account menu"
            >
              <UserCircleIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
              <span className="hidden sm:inline text-gray-700 dark:text-gray-200 font-medium">Account</span>
            </button>
            {accountOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                <button className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                  <Cog6ToothIcon className="w-5 h-5" /> Preferences
                </button>
                <button
                  className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  onClick={handleLogout}
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" /> Log Out
                </button>
                <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
                <button
                  className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  onClick={() => setDarkMode((d) => !d)}
                >
                  {darkMode ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />} {darkMode ? "Dark" : "Light"} Mode
                </button>
              </div>
            )}
          </div>
          {/* Dark mode toggle for mobile */}
          <button
            className="sm:hidden ml-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            onClick={() => setDarkMode((d) => !d)}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <MoonIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" /> : <SunIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />}
          </button>
        </div>
      </div>
    </nav>
  );
} 