import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import StudentDashboard from './pages/StudentDashboard';
import StudentsPage from './pages/StudentsPage';
import FacultyPage from './pages/FacultyPage';
import DepartmentsPage from './pages/DepartmentsPage';
import AttendancePage from './pages/AttendancePage';
import BiometricConsolePage from './pages/BiometricConsolePage';
import LeaveManagementPage from './pages/LeaveManagementPage';
import AttendanceCalendarPage from './pages/AttendanceCalendarPage';
import ReportsPage from './pages/ReportsPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function RoleBasedDashboard() {
  const { user } = useAuth();
  if (user?.role === 'ROLE_ADMIN') return <AdminDashboard />;
  if (user?.role === 'ROLE_FACULTY') return <FacultyDashboard />;
  return <StudentDashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<RoleBasedDashboard />} />
              <Route path="students" element={<StudentsPage />} />
              <Route path="faculty" element={<FacultyPage />} />
              <Route path="departments" element={<DepartmentsPage />} />
              <Route path="attendance" element={<AttendancePage />} />
              <Route path="my-attendance" element={<StudentDashboard />} />
              <Route path="biometric-console" element={<BiometricConsolePage />} />
              <Route path="leave-management" element={<LeaveManagementPage />} />
              <Route path="apply-leave" element={<LeaveManagementPage />} />
              <Route path="attendance-calendar" element={<AttendanceCalendarPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}
