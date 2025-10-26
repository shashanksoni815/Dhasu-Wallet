import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './Context/AuthContext';
import { ExpenseProvider } from './Context/ExpenceContext';
import { TripProvider } from './Context/TripContext';
import { GroupProvider } from './Context/GroupContext';
import Home from './Pages/Home';
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import Layout from './Components/App/Layout';
import Dashboard from './Pages/AppPages/Dashboard';
import Expenses from './Pages/AppPages/Expence';
import Trips from './Pages/AppPages/Trips';
import TripDetail from './Pages/AppPages/TripDetail';
import Groups from './Pages/AppPages/Groups';
import GroupDetail from './Pages/AppPages/GroupDetail';
import Profile from './Pages/AppPages/Profile';

import Features from './Pages/Features';
import HowItWorks from './Pages/HowItWorks';
import Pricing from './Pages/Pricing';
import LiveDemo from './Pages/LiveDemo';
import About from './Pages/About';
import Contact from './Pages/Contact';
import HelpCenter from './Pages/HelpCenter';
import PrivacyPolicy from './Pages/PrivacyPolicy';
import TermsOfService from './Pages/TermsOfService';
import Security from './Pages/Security';


// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return isAuthenticated ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

// Public Route Component (redirect to app if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return !isAuthenticated ? children : <Navigate to="/app" />;
};

function App() {
  return (
    <AuthProvider>
      <ExpenseProvider>
        <TripProvider>
        <GroupProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/demo" element={<LiveDemo />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/help" element={<HelpCenter />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/security" element={<Security />} />
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          
          {/* Protected App Routes */}
          <Route path="/app" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/app/expenses" element={
            <ProtectedRoute>
              <Expenses />
            </ProtectedRoute>
          } />
          <Route path="/app/trips" element={
            <ProtectedRoute>
              <Trips />
            </ProtectedRoute>
          } />
          <Route path="/app/trips/:tripId" element={ // Add trip detail route
                <ProtectedRoute>
                  <TripDetail />
                </ProtectedRoute>
          } />
          <Route path="/app/groups" element={
            <ProtectedRoute>
              <Groups />
            </ProtectedRoute>
          } />
          <Route path="/app/groups/:groupId" element={ // Add group detail route
                  <ProtectedRoute>
                    <GroupDetail />
                  </ProtectedRoute>
          } />
          <Route path="/app/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          {/* Redirect any unknown routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      </GroupProvider>
      </TripProvider>
      </ExpenseProvider>
    </AuthProvider>
  );
}

export default App;