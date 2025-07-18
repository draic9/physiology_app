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
  const [darkMode, setDarkMode] = useState(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen w-screen flex items-center justify-center transition-colors duration-300 bg-gray-100 dark:bg-gray-900">
      <div
        className={`
          w-full max-w-2xl p-8 rounded-3xl neumorph dark:neumorph-dark
          flex flex-col items-center
          transition-all duration-300
          mt-8 mb-8
          bg-gray-50 dark:bg-gray-800
          text-gray-900 dark:text-gray-100
        `}
      >
        <div className="flex justify-end w-full mb-2">
          <button
            className={`
              px-4 py-2 rounded-full shadow-md border-2 border-yellow-400
              transition-all duration-200 neumorph-btn dark:neumorph-btn-dark
              bg-white text-yellow-700 dark:bg-gray-800 dark:text-yellow-200
            `}
            onClick={() => setDarkMode((d) => !d)}
            aria-label="Toggle dark mode"
          >
            {darkMode ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>
        <h1 className="text-4xl font-extrabold mb-2 text-center tracking-tight drop-shadow">
          Physiology App
        </h1>
        <p className="text-center mb-6 text-lg opacity-80">
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
              <span className="text-xs opacity-70 mt-1">{tech.name}</span>
            </a>
          ))}
        </div>
        <div
          className={`
            rounded-xl p-4 mt-4 w-full neumorph-inner dark:neumorph-inner-dark
            bg-white dark:bg-gray-900
          `}
        >
          <p className="text-center text-base mb-2 font-semibold">
            React and TailwindCSS are working!
          </p>
          <p className="text-center text-xs opacity-70">
            Try toggling dark mode above.
          </p>
        </div>
        <footer className="mt-10 text-center text-xs opacity-60 w-full">
          &copy; {new Date().getFullYear()} Physiology — Powered by your Tech Stack
        </footer>
      </div>
    </div>
  );
}
