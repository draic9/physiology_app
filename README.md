# Physiology App

A full-stack web application for physiology data visualization and management.

---

## Tech Stack

### Frontend

- **React** + **Vite** (TypeScript)
- **TailwindCSS v4** (via `@tailwindcss/vite`)
- **Chart.js** via `react-chartjs-2`
- **React Router DOM** for navigation

### Backend

- **Node.js** + **Express**
- **SQLite**
- **REST API** to communicate with frontend

---

## Project Structure

```
physiology-app/
│
├── frontend/   # React + Vite client
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── assets/
│       └── main.tsx
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/    # Node.js + Express server
│   └── src/
│       ├── db/
│       ├── routes/
│       └── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
└── README.md   # Project documentation
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Setup

#### 1. Install dependencies

From the project root, run:

```bash
cd frontend
npm install

cd ../backend
npm install
```

#### 2. Running the Backend

```bash
npm run build      # Compile TypeScript
npm start          # Start Express server
```

#### 3. Running the Frontend

```bash
npm run dev        # Start Vite dev server
```

#### 4. Development Workflow

- The frontend runs on [http://localhost:5173](http://localhost:5173) by default.
- The backend runs on [http://localhost:3000](http://localhost:3000) by default.
- The frontend communicates with the backend via REST API endpoints.

#### 5. Running Frontend & Backend Together

You can run both servers with a single command from the project root using [concurrently](https://www.npmjs.com/package/concurrently):

```bash
npm run dev
```

This will start both the backend and frontend development servers at once.  
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:3000](http://localhost:3000)

Make sure you have installed dependencies in both `frontend` and `backend` folders before

---

## Configuration

- **CORS** is enabled in the backend to allow frontend requests.
- **SQLite** is used for persistent storage (see `backend/src/db/`).
- **API routes** are defined in `backend/src/routes/`.

---

## Scripts

### Frontend

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run lint` — Lint code

### Backend

- `npm run build` — Compile TypeScript
- `npm start` — Start server

---

## License

MIT

---

## Author

Jakub Samosiuk