# 🎨 HireGuard AI — Frontend Interface

The **HireGuard AI** frontend is a high-fidelity React application designed for recruiters to manage candidates, view AI-driven reports, and monitor real-time interview progress.

---

## ✨ Features

- **Glassmorphic UI**: A modern, sleek interface built with a customized design system.
- **Interactive Analytics**: Visual failure trends and integrity scoring using `recharts`.
- **Dynamic Animations**: Smooth transitions and interaction feedback powered by `framer-motion`.
- **Responsive Tables**: Sophisticated candidate management dashboards with filtering and status tracking.
- **Real-Time Interview Hub**: A dedicated interface for candidates to participate in AI-led evaluations.

---

## 🛠️ Tech Stack

- **Framework**: [Vite](https://vitejs.dev/) + [React 19](https://react.dev/)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/)
- **State Management**: React Context API
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Motion/UX**: [Framer Motion](https://www.framer.com/motion/)

---

## 🚦 Getting Started

### 1. Environment Variables

Create a `.env` file in the `frontend/` directory with the following variable:

```env
# URL of the running backend server
VITE_API_BASE_URL=http://localhost:5000
```

### 2. Installation & Execution

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:5173` (default Vite port).

---

## 🏗️ Core Pages

- **Dashboard**: Overview of recruitment pipeline and integrity metrics.
- **Candidates**: Manage candidate profiles, upload resumes, and view AI scores.
- **Candidate Report**: Detailed technical and risk breakdown for a specific candidate.
- **Analytics**: High-level failure trending and technical landscape analysis.
- **Account Settings**: Manage recruiter profile and organizational preferences.

---

## 📁 Directory Structure

- `src/components/`: Reusable UI elements (Navbar, ProtectedRoute, etc.).
- `src/context/`: Authentication and Global state management.
- `src/pages/`: Main application views.
- `src/assets/`: Static assets and style tokens.
