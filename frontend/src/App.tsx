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
import PatientDetails from './pages/PatientDetails';

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
      { path: 'doctor-dashboard', element: <DoctorDashboard /> },
      { path: 'patient-details/:id', element: <PatientDetails /> },
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
