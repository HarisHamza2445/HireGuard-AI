# ⚙️ HireGuard AI — Backend Server

The **HireGuard AI** backend is a robust Node.js/Express application that orchestrates multiple AI agents to perform deep candidate analysis and manage recruitment workflows.

---

## 🛠️ Tech Stack

- **Framework**: Express 5 (latest)
- **Runtime**: Node.js
- **Database**: MongoDB (via Mongoose)
- **AI Integration**: OpenAI SDK (compatible with OpenRouter)
- **File Handling**: Multer for PDF uploads
- **Authentication**: JWT with `bcryptjs`

---

## 🚦 Getting Started

### 1. Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
MONGO_URI=your_mongodb_connection_string

# AI / OpenRouter Configuration
OPENAI_API_KEY=your_openrouter_api_key

# Authentication
JWT_SECRET=your_super_secret_key
```

### 2. Installation & Execution

```bash
# Install dependencies
npm install

# Run in development mode (with nodemon)
npm run dev

# Run in production mode
npm start
```

---

## 🤖 Agent Orchestrator Flow

The backend utilizes an "Orchestrator" pattern to handle multi-step candidate verification:

1. **Resume Intelligence Agent**: Extracts structured data and performs fraud analysis.
2. **Employment Verification Agent**: Validates career timeline and company reputation.
3. **Technical Intelligence Agent**: Cross-references skills with GitHub activity.
4. **Risk Assessment Agent**: Calculates a final integrity score and risk profile.

All steps are logged in the `AuditLog` collection for transparency and debugging.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new recruiter account. |
| `POST` | `/api/auth/login` | Authenticate and receive a JWT. |
| `POST` | `/api/candidates/upload` | Upload a resume PDF for AI analysis. |
| `GET` | `/api/candidates/:id` | Retrieve detailed candidate report & AI scores. |
| `POST` | `/api/interview/:id` | Initialize/Continue an AI-led interview session. |

---

## 📁 Directory Structure

- `agents/`: Individual AI logic for specific verification tasks.
- `orchestrator/`: The `agentOrchestrator.js` which manages the multi-agent flow.
- `controllers/`: Request handlers for common features (Auth, Candidates, etc.).
- `models/`: Mongoose schemas for MongoDB storage.
- `routes/`: Routing logic for the API.
