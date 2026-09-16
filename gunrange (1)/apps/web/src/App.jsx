import React, { lazy, Suspense } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PageLoader from './components/PageLoader';

// Lazy-loaded pages (code splitting)
const HomePage = lazy(() => import('./pages/HomePage'));
const ListYourRangePage = lazy(() => import('./pages/ListYourRangePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const AdminRangesPage = lazy(() => import('./pages/AdminRangesPage'));
const StatePage = lazy(() => import('./pages/StatePage'));
const RangeDetailPage = lazy(() => import('./pages/RangeDetailPage'));
const FirearmsLawPage = lazy(() => import('./pages/FirearmsLawPage')); 

function App() {
    return (
        <Router>
            <AuthProvider>
                <ScrollToTop />
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/list-your-range" element={<ListYourRangePage />} />
                        <Route path="/maryland" element={<StatePage stateCode="MD" />} />
                        <Route path="/virginia" element={<StatePage stateCode="VA" />} />
                        <Route path="/washington-dc" element={<StatePage stateCode="DC" />} />
                        <Route path="/ranges/:slug" element={<RangeDetailPage />} />
                        <Route path="/firearms-law" element={<FirearmsLawPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route
                            path="/admin/ranges"
                            element={
                                <ProtectedRoute>
                                    <AdminRangesPage />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </Suspense>
            </AuthProvider>
        </Router>
    );
} 

export default App;
