import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './api/client';
import { useSyncManager } from './hooks/useSyncManager';

// Layouts
import { AppLayout } from './layouts/AppLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

// Pages
import Login from './pages/Login';
import PatientSurvey from './pages/PatientSurvey';
import DoctorDashboard from './pages/DoctorDashboard';
import Patients from './pages/Patients';
import PatientDetails from './pages/PatientDetails';
import AshaDashboard from './pages/AshaDashboard';
import UserDashboard from './pages/UserDashboard';

const RequireAuth: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { path: '/', element: <Navigate to="/login" replace /> },
      { path: 'login', element: <Login /> },
      { path: 'patient-survey', element: <PatientSurvey /> },
    ],
  },
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      // {
      //   path: 'doctor-dashboard',
      //   element: (
      //     <RequireAuth>
      //       <DoctorDashboard />
      //     </RequireAuth>
      //   ),
      // }
      {
        path: "/doctor-dashboard",
        element: <DoctorDashboard />
      },
      {
        path: "/patients",
        element: <Patients />
      },
      {
        path: "/asha-dashboard",
        element: <AshaDashboard />
      },
      {
        path: "/user-dashboard",
        element: <UserDashboard />
      },
      {
        path: 'patient-details/:id',
        element: (
          <RequireAuth>
            <PatientDetails />
          </RequireAuth>
        ),
      },
    ],
  },
]);

function App() {
  useSyncManager(); // Initialize global offline survey synchronization
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
