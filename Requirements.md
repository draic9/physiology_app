# Physiology App Requirements

## Purpose

This web application is a simulation and educational tool aimed at students of medicine, biology, or related fields. It acts as a **replacement for PhysioEx** (by Pearson), providing a lighter, more transparent and modern alternative for conducting and understanding physiological experiments — starting with **skeletal muscle response**. The goal is to make it both **interactive** and **visually digestible**.

---

## Tech Stack & Setup

* **Frontend**: React (set up via Vite, not CRA)
* **Language**: TypeScript
* **Styling**: Tailwind CSS **v4.6**

  * Tailwind is **not used as a PostCSS plugin**
  * Imported globally in `index.css` via:

    ```css
    @import "tailwindcss";
    ```
* **Routing**: `react-router-dom`
* **Charts**: `chart.js` via `react-chartjs-2`
* **Backend**: Node.js with Express
* **Database**: SQLite (used for login state & progress persistence)
* **API**: RESTful (to be expanded as needed)
* **Documentation**: Markdown (`/docs/README.md` and others)

---

## UI Requirements

### 🔐 Mock Login Screen

* A simple screen with username + password fields
* No actual authentication (mock only)
* A single button to proceed

---

### 🧭 Menu Bar (Global Navigation)

* A responsive **top navigation bar** visible on all screens (except login)
* Contains:

  * **Left-aligned logo** (text or image)
  * **Right-aligned navigation links**:

    * "Experiments"
    * "Account"
* Should adapt to screen sizes (collapsible or hamburger menu on mobile)

---

### 🧪 Dashboard

* Responsive dashboard showing available experiments
* Visual grid or card layout
* At least **two experiments listed**

  * One **unlocked/available**
  * One **locked/unavailable** (grayed out or with lock icon)

---

### 📊 Experiment Screen

A single responsive page split into a **2x2 layout**:

#### Layout Grid:

|                          |                                            |
| ------------------------ | ------------------------------------------ |
| **\[1] Parameters Form** | **\[2] Description & Follow-up Questions** |
| **\[3] Chart/Graph**     | **(\[2]continued)**                            |

#### \[1] Parameters Form

* Input fields that mimic a skeletal muscle testing interface
* E.g., stimulus strength, frequency, duration
* Form can be non-functional for now (mock input)

#### \[2] Description & Follow-up Panel

* Text content loaded from **external Markdown file**
* Can include explanations, experiment background, and questions
* Scrollable area, possibly with collapsible sections

#### \[3] Chart/Graph

* Line chart or bar graph generated using Chart.js
* Plots randomized values (mocked physiological response)
* Reactive to mock inputs (e.g., re-renders on submit)

---

### 💡 Responsiveness & UX

* All screens must adapt gracefully to different screen sizes
* **User-adjustable panels** are desired (e.g., draggable or resizable split)
* Dark mode support

---

## Future Enhancements (not part of MVP)

* Login verification with real auth
* Saving experiment data to database
* Markdown-based experiment definitions
* Admin UI for adding/editing experiments

---

This document defines the MVP scope and frontend layout expectations. Backend functionality can be mocked for now but should be scaffolded with future expansion in mind.

---

# Further work

🔖 Top Navigation Menu
The application must include a top navigation menu that remains fixed at the top of the viewport. It should contain the following elements:

1. Logo (left-aligned)
Clicking the logo redirects to the homepage (or dashboard if logged in). As of now there is no homepage.

2. Navigation Links (right-aligned)
Experiments – leads to the dashboard of available experiments.

Additional links (e.g., Dashboard, Tutorials, Docs) may be added in the future using the same style and alignment.

3. Account Menu (right-aligned)
A dropdown that includes:
- Preferences
- Log Out

4. Dark Mode Toggle (right-aligned)
A toggle switch icon (e.g., sun/moon) next to or within the account dropdown.

Toggling should immediately apply light/dark themes without a page reload using tailwind features.

The preference should be remembered between sessions (via localStorage or user settings).

The menu should be mobile friendly when viewed as such.