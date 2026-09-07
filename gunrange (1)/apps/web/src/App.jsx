import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import ListYourRangePage from './pages/ListYourRangePage';
import LoginPage from './pages/LoginPage';
import AdminRangesPage from './pages/AdminRangesPage';
import StatePage from './pages/StatePage';
import RangeDetailPage from './pages/RangeDetailPage';
import FirearmsLawPage from './pages/FirearmsLawPage';

function App() {
    return (
        <Router>
            <AuthProvider>
                <ScrollToTop />
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
            </AuthProvider>
        </Router>
    );
}

export default App;
