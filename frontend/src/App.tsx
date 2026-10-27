import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RippleProvider } from './context/RippleContext';
import { DashboardLayout } from './layouts/DashboardLayout';

// Pages
import { OverviewDashboard } from './pages/OverviewDashboard';
import { RippleAnalysisPage } from './pages/RippleAnalysisPage';
import { PriorityQueuePage } from './pages/PriorityQueuePage';
import { ResourceRegistryPage } from './pages/ResourceRegistryPage';
import { ComplaintManagementPage } from './pages/ComplaintManagementPage';
import { CityProblemsPage } from './pages/CityProblemsPage';
import { ReportProblemPage } from './pages/ReportProblemPage';
import { MyComplaintsPage } from './pages/MyComplaintsPage';
import { CommunityIdeasPage } from './pages/CommunityIdeasPage';
import { DigOncePage } from './pages/DigOncePage';
import { SilentWardPage } from './pages/SilentWardPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { LandingPage } from './pages/LandingPage';

export const App: React.FC = () => {
  return (
    <RippleProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Standalone Landing Page */}
          <Route
            path="/landing"
            element={<LandingPage onExplore={() => (window.location.href = '/')} />}
          />

          {/* Demonstration Authentication Pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Main Application Shell with Shared Navbar & Sidebar */}
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<OverviewDashboard />} />
            <Route path="/overview" element={<OverviewDashboard />} />
            <Route path="/ripple-analysis" element={<RippleAnalysisPage />} />
            <Route path="/priority-queue" element={<PriorityQueuePage />} />
            <Route path="/resources" element={<ResourceRegistryPage />} />
            <Route path="/complaints" element={<ComplaintManagementPage />} />
            <Route path="/city-problems" element={<CityProblemsPage />} />
            <Route path="/report" element={<ReportProblemPage />} />
            <Route path="/my-complaints" element={<MyComplaintsPage />} />
            <Route path="/community-ideas" element={<CommunityIdeasPage />} />
            <Route path="/dig-once" element={<DigOncePage />} />
            <Route path="/silent-ward" element={<SilentWardPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Route>

          {/* Fallback to Overview */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </RippleProvider>
  );
};

export default App;
