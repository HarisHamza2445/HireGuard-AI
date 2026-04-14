# 🛡️ HireGuard AI — The Future of Intelligent Recruitment

[![React](https://img.shields.io/badge/Frontend-React%2019-blue?style=flat-square&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![OpenAI](https://img.shields.io/badge/AI-OpenAI-orange?style=flat-square&logo=openai)](https://openai.com/)

**HireGuard AI** is a premium, AI-powered recruitment platform designed to automate the heavy lifting of candidate verification and interviewing. By leveraging an advanced **Agentic Orchestrator**, HireGuard AI provides deep insights into candidate credibility, technical skills, and risk profiles before you even hop on a call.

---

## 🚀 Key Features

- **🤖 Multi-Agent Verification**: A suite of specialized AI agents (Resume, Employment, Tech, and Risk) that work in tandem to evaluate candidates.
- **🎙️ AI-Led Interviews**: Conduct automated, technical interviews that adapt to the candidate's responses in real-time.
- **📊 Real-Time Analytics**: A high-fidelity dashboard with failure trend analysis, integrity scores, and candidate performance metrics.
- **📄 Smart Resume Parsing**: Automatic extraction and cross-verification of data from PDF resumes.
- **🛡️ Fraud Detection**: Built-in intelligence to identify discrepancies and potential "red flags" in professional history.
- **✨ Premium UI/UX**: A glassmorphic, responsive design system built with Framer Motion and Tailwind CSS.

---

## 🏗️ Agentic Intelligence Architecture

The heart of HireGuard AI is the **Agent Orchestrator**, which manages the following specialized agents:

| Agent | Responsibility |
| :--- | :--- |
| **Resume Intelligence** | Extracts structured data and performs initial fraud analysis on documents. |
| **Employment Verification** | Analyzes career progression and verifies company histories. |
| **Technical Intelligence** | Evaluates skill sets and cross-references GitHub activity for technical depth. |
| **Risk Assessment** | Synthesizes data from all agents to provide a final integrity and risk score. |

---

## 🛠️ Repository Structure

```text
HireGuard-AI/
├── frontend/           # Vite + React 19 Client
│   ├── src/pages/      # Dashboard, Analytics, Interview, Settings
│   └── src/components/ # Shared UI components
└── backend/            # Express + Node.js Server
    ├── agents/         # AI Logic for specialized verification agents
    ├── orchestrator/   # Central logic for multi-agent workflows
    ├── models/         # Mongoose schemas (AuditLog, User, etc.)
    └── routes/         # API endpoints
```

---

## 🏁 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (Atlas or Local)
- OpenAI API Key

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/HarisHamza2445/HireGuard-AI.git
   cd HireGuard-AI
   ```

2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   # Create a .env file (see backend/README.md)
   npm run dev
   ```

3. **Setup Frontend**:
   ```bash
   cd ../frontend
   npm install
   # Create a .env file (see frontend/README.md)
   npm run dev
   ```

---

## 📜 License

Distributed under the **ISC License**. See `LICENSE` for more information.

---

Built with ❤️ by the HireGuard Team.
