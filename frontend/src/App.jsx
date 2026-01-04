import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import SeekerAuth from './pages/SeekerAuth';
import EmployerAuth from './pages/EmployerAuth';
import EmployerDashboard from './pages/EmployerDashboard';
import JobsList from './pages/JobsList';

function ProtectedRoute({ children, requireEmployer }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  if (requireEmployer && user.role !== 'EMPLOYER') {
    return <Navigate to="/jobs" />;
  }

  if (!requireEmployer && user.role === 'EMPLOYER') {
    return <Navigate to="/employer/dashboard" />;
  }

  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={user.role === 'EMPLOYER' ? '/employer/dashboard' : '/jobs'} /> : <LandingPage />} />
      <Route path="/seeker/auth" element={user ? <Navigate to="/jobs" /> : <SeekerAuth />} />
      <Route path="/employer/auth" element={user ? <Navigate to="/employer/dashboard" /> : <EmployerAuth />} />
      
      <Route path="/employer/dashboard" element={
        <ProtectedRoute requireEmployer>
          <EmployerDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/jobs" element={
        <ProtectedRoute>
          <JobsList />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;