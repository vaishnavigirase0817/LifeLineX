/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import HealthChecker from './pages/HealthChecker';
import Emergency from './pages/Emergency';
import HealthMap from './pages/HealthMap';
import Consultation from './pages/Consultation';
import Schemes from './pages/Schemes';
import { useStore } from './store/useStore';
import { db } from './lib/firebase';
import { doc, getDocFromServer } from 'firebase/firestore';
import { useEffect } from 'react';

import Profile from './pages/Profile';
import Settings from './pages/Settings';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useStore((state) => state.user);
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

export default function App() {
  useEffect(() => {
    // Validate Connection to Firestore
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, '_internal_', 'connection_test'));
        console.log("Firebase connection established.");
      } catch (error: any) {
        if (error.message?.includes('the client is offline') || error.code === 'unavailable') {
          console.error("Please check your Firebase configuration.");
        }
      }
    };
    testConnection();
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          
          {/* Protected Area */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/checker" element={
            <ProtectedRoute><HealthChecker /></ProtectedRoute>
          } />
          <Route path="/emergency" element={
            <ProtectedRoute><Emergency /></ProtectedRoute>
          } />
          <Route path="/map" element={
            <ProtectedRoute><HealthMap /></ProtectedRoute>
          } />
          <Route path="/consultation" element={
            <ProtectedRoute><Consultation /></ProtectedRoute>
          } />
          <Route path="/schemes" element={
            <ProtectedRoute><Schemes /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute><Settings /></ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}
