import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProtectedRoute from './components/common/ProtectedRoute';

// Temporary placeholder components (will be created in next PRs)
const Dashboard = () => <div className="p-8"><h1 className="text-2xl">Dashboard (Coming Soon)</h1></div>;
const Players = () => <div className="p-8"><h1 className="text-2xl">Players (Coming Soon)</h1></div>;
const Matches = () => <div className="p-8"><h1 className="text-2xl">Matches (Coming Soon)</h1></div>;
const Openings = () => <div className="p-8"><h1 className="text-2xl">Openings (Coming Soon)</h1></div>;
const Analytics = () => <div className="p-8"><h1 className="text-2xl">Analytics (Coming Soon)</h1></div>;

function App() {
    const { theme } = useSelector((state) => state.ui);

    return (
        <Router>
            <Routes>
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Routes */}
                <Route path="/" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                <Route path="/players" element={
                    <ProtectedRoute>
                        <Players />
                    </ProtectedRoute>
                } />
                <Route path="/matches" element={
                    <ProtectedRoute>
                        <Matches />
                    </ProtectedRoute>
                } />
                <Route path="/openings" element={
                    <ProtectedRoute>
                        <Openings />
                    </ProtectedRoute>
                } />
                <Route path="/analytics" element={
                    <ProtectedRoute>
                        <Analytics />
                    </ProtectedRoute>
                } />
            </Routes>
        </Router>
    );
}

export default App;
