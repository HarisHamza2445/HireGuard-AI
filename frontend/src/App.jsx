import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Candidates from "./pages/Candidates";
import CandidateReport from "./pages/CandidateReport";
import Settings from "./pages/Settings";
import AccountSettings from "./pages/AccountSettings";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CandidateInterview from "./pages/CandidateInterview";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function AppContent() {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname.startsWith('/interview');

    return (
        <>
            {!isAuthPage && <Navbar />}
            <Routes>
                {/* Public Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/interview/:id" element={<CandidateInterview />} />

                {/* Secure Encrypted Routes */}
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/candidates" element={<ProtectedRoute><Candidates /></ProtectedRoute>} />
                <Route path="/candidates/:id" element={<ProtectedRoute><CandidateReport /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/account-settings" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
            </Routes>
        </>
    );
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppContent />
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
