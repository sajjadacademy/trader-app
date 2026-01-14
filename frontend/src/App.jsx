import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MobileApp from './MobileApp';
import AdminPanel from './pages/admin/AdminPanel';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: 20, color: 'white', background: 'black', height: '100vh', overflow: 'scroll' }}>
                    <h1>Something went wrong.</h1>
                    <pre style={{ color: 'red' }}>{this.state.error && this.state.error.toString()}</pre>
                </div>
            );
        }

        return this.props.children;
    }
}

function App() {
    return (
        <ErrorBoundary>
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
        </ErrorBoundary>
    );
}

export default App;
