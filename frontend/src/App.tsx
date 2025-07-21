import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

const techStack = [
  { name: "React", logo: reactLogo, url: "https://react.dev" },
  { name: "Vite", logo: viteLogo, url: "https://vite.dev" },
  { name: "TailwindCSS", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg", url: "https://tailwindcss.com/" },
  { name: "Chart.js", logo: "https://www.chartjs.org/img/chartjs-logo.svg", url: "https://www.chartjs.org/" },
  { name: "React Router", logo: "https://reactrouter.com/favicon-light.png", url: "https://reactrouter.com/" },
];

export default function App() {
  const [count, setCount] = useState(0);
  const [darkMode, setDarkMode] = useState(() => {
    // Optional: persist dark mode in localStorage
    return localStorage.getItem("theme") === "dark";
  });

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

  return (
    <div className="w-screen h-screen bg-white dark:bg-gray-900 transition-colors">
      <div className="w-full h-full bg-black/5 dark:bg-black/30 flex items-center justify-center">
        <div className="w-full max-w-2xl p-8 rounded-3xl shadow-lg bg-white dark:bg-gray-800 flex flex-col items-center transition-all duration-300">
          <div className="w-full flex justify-end mb-2">
            <button
              className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-xs font-semibold shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              onClick={() => setDarkMode((d) => !d)}
              aria-label="Toggle dark mode"
            >
              {darkMode ? "🌙 Dark" : "☀️ Light"}
            </button>
          </div>
          <h1 className="text-4xl font-extrabold mb-2 text-center tracking-tight drop-shadow text-emerald-500 dark:text-emerald-300">
            Physiologi
          </h1>
          <p className="text-center mb-6 text-lg opacity-80 text-gray-700 dark:text-gray-200">
            🚀 React + Vite + TailwindCSS + Chart.js + React Router
          </p>
          <div className="flex justify-center gap-6 mb-6 flex-wrap">
            {techStack.map((tech) => (
              <a
                key={tech.name}
                href={tech.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center group"
              >
                <img
                  src={tech.logo}
                  alt={tech.name}
                  className="w-14 h-14 mb-2 transition-transform group-hover:scale-110"
                  style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.08))" }}
                />
                <span className="text-xs opacity-70 mt-1 text-gray-700 dark:text-gray-200">{tech.name}</span>
              </a>
            ))}
          </div>
          <div className="rounded-xl p-4 mt-4 bg-white dark:bg-gray-700 w-full glassmorphism">
            <p className="text-center text-base mb-2 font-semibold text-gray-800 dark:text-gray-100">
              Click the counter below!
            </p>
            <button
              className="mx-auto block px-6 py-2 rounded-full bg-emerald-500 text-white font-bold shadow-lg hover:bg-emerald-600 transition"
              onClick={() => setCount((c) => c + 1)}
            >
              Count: {count}
            </button>
          </div>
          <div className="p-4 mt-6 rounded-2xl bg-gray-200 dark:bg-pink-600 text-black dark:text-white text-center">
            This box should be <b>pink</b> in dark mode and <b>gray</b> in light mode.
          </div>
          <footer className="mt-10 text-center text-xs opacity-60 w-full text-gray-600 dark:text-gray-300">
            &copy; {new Date().getFullYear()} Physiologi powered by <strong>big coq</strong>
          </footer>
        </div>
      </div>
    </div>
  );
}
