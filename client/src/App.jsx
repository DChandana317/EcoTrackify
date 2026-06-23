import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { PublicRoute } from './components/PublicRoute.jsx';
import { DashboardLayout } from './layouts/DashboardLayout.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage.jsx';
import DashboardPage from './pages/app/DashboardPage.jsx';
import CarbonTrackerPage from './pages/app/CarbonTrackerPage.jsx';
import GoalsPage from './pages/app/GoalsPage.jsx';
import CommunityPage from './pages/app/CommunityPage.jsx';
import NotificationsPage from './pages/app/NotificationsPage.jsx';
import BusinessPage from './pages/app/BusinessPage.jsx';
import SettingsPage from './pages/app/SettingsPage.jsx';

const App = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />

    <Route element={<PublicRoute />}>
      <Route path="/auth">
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot" element={<ForgotPasswordPage />} />
        <Route index element={<Navigate to="login" replace />} />
      </Route>
    </Route>

    <Route element={<ProtectedRoute />}>
      <Route path="/app" element={<DashboardLayout />}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="track" element={<CarbonTrackerPage />} />
        <Route path="goals" element={<GoalsPage />} />
        <Route path="community" element={<CommunityPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="business" element={<BusinessPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
