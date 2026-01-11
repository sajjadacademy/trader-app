import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MobileApp from './MobileApp';
import AdminPanel from './pages/admin/AdminPanel';

function App() {
    return (
        <Router>
            <Routes>
                {/* Mobile App (Default Route) */}
                <Route path="/" element={<MobileApp />} />

                {/* Admin Panel (Separate Desktop Route) */}
                <Route path="/admin" element={<AdminPanel />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
