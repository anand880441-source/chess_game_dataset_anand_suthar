import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Players = lazy(() => import('./pages/Players'));
const Matches = lazy(() => import('./pages/Matches'));
const Openings = lazy(() => import('./pages/Openings'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Settings = lazy(() => import('./pages/Settings'));

const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
);

function App() {
    return (
        <Router>
            <Routes>
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Routes with Top Navbar Layout */}
                <Route path="/" element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Suspense fallback={<LoadingSpinner />}>
                                <Dashboard />
                            </Suspense>
                        </MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Suspense fallback={<LoadingSpinner />}>
                                <Dashboard />
                            </Suspense>
                        </MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/players" element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Suspense fallback={<LoadingSpinner />}>
                                <Players />
                            </Suspense>
                        </MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/matches" element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Suspense fallback={<LoadingSpinner />}>
                                <Matches />
                            </Suspense>
                        </MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/openings" element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Suspense fallback={<LoadingSpinner />}>
                                <Openings />
                            </Suspense>
                        </MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/analytics" element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Suspense fallback={<LoadingSpinner />}>
                                <Analytics />
                            </Suspense>
                        </MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/settings" element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Suspense fallback={<LoadingSpinner />}>
                                <Settings />
                            </Suspense>
                        </MainLayout>
                    </ProtectedRoute>
                } />
            </Routes>
        </Router>
    );
}

export default App;
