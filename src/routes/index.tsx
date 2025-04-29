import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '../components/auth/Login';
import SignUp from '../components/auth/SignUp';
import Dashboard from '../components/dashboard/Dashboard';
import Upload from '../components/dashboard/Upload';
import Summaries from '../components/dashboard/Summaries';
import PromptLibrary from '../components/dashboard/PromptLibrary';
import { getCurrentUser } from '../utils/storage';

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public Route wrapper (redirects to dashboard if already authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const currentUser = getCurrentUser();
  
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: '/signup',
    element: (
      <PublicRoute>
        <SignUp />
      </PublicRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/upload',
    element: (
      <ProtectedRoute>
        <Upload />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/summaries',
    element: (
      <ProtectedRoute>
        <Summaries />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/prompt-library',
    element: (
      <ProtectedRoute>
        <PromptLibrary />
      </ProtectedRoute>
    ),
  },
]); 