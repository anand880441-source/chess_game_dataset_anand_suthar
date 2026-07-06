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
const PlayerDetail = lazy(() => import('./pages/PlayerDetail'));
const Matches = lazy(() => import('./pages/Matches'));
const MatchDetail = lazy(() => import('./pages/MatchDetail'));
const Openings = lazy(() => import('./pages/Openings'));
const OpeningDetail = lazy(() => import('./pages/OpeningDetail'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const ComparePlayers = lazy(() => import('./pages/ComparePlayers'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));


// Chess-themed loading spinner
const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center animate-pulse">
                <svg className="w-8 h-8 text-white animate-float" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 22H5v-2h14v2M17.16 8.26A8.94 8.94 0 0018 5h-2a7 7 0 01-.59 2.84L12 11.28 8.59 7.84A7 7 0 018 5H6a8.94 8.94 0 00.84 3.26L12 13.43l5.16-5.17M12 2a1 1 0 011 1 1 1 0 01-1 1 1 1 0 01-1-1 1 1 0 011-1M17 20H7l2-8h6l2 8z" />
                </svg>
            </div>
            <div className="absolute inset-0 rounded-2xl bg-primary-500/20 animate-ping"></div>
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">Loading...</p>
    </div>
);

function App() {
    return (
        <Router>
            <Routes>
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes with Layout */}
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
                <Route path="/players/:username" element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Suspense fallback={<LoadingSpinner />}>
                                <PlayerDetail />
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
                <Route path="/matches/:id" element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Suspense fallback={<LoadingSpinner />}>
                                <MatchDetail />
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
                <Route path="/openings/:ecoCode" element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Suspense fallback={<LoadingSpinner />}>
                                <OpeningDetail />
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
                <Route path="/profile" element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Suspense fallback={<LoadingSpinner />}>
                                <Profile />
                            </Suspense>
                        </MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/search" element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Suspense fallback={<LoadingSpinner />}>
                                <SearchResults />
                            </Suspense>
                        </MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/compare" element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Suspense fallback={<LoadingSpinner />}>
                                <ComparePlayers />
                            </Suspense>
                        </MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/admin" element={
                    <ProtectedRoute adminOnly={true}>
                        <MainLayout>
                            <Suspense fallback={<LoadingSpinner />}>
                                <AdminDashboard />
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
