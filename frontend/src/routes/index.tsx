import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';

// --- Synchronous core layouts ---
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';

// --- Loading Fallback ---
const LoadingScreen = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
    <CircularProgress />
  </Box>
);

// --- Lazy Loaded Pages ---
const LoginPage = lazy(() => import('../pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage').then(m => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage').then(m => ({ default: m.ResetPasswordPage })));
const SessionExpiredPage = lazy(() => import('../pages/auth/SessionExpiredPage').then(m => ({ default: m.SessionExpiredPage })));

const DashboardOverviewPage = lazy(() => import('../pages/dashboard/DashboardOverviewPage').then(m => ({ default: m.DashboardOverviewPage })));
const ViewProfilePage = lazy(() => import('../pages/profile/ViewProfilePage').then(m => ({ default: m.ViewProfilePage })));
const EditProfilePage = lazy(() => import('../pages/profile/EditProfilePage').then(m => ({ default: m.EditProfilePage })));

const AssessmentLandingPage = lazy(() => import('../pages/assessment/AssessmentLandingPage').then(m => ({ default: m.AssessmentLandingPage })));
const AssessmentEnginePage = lazy(() => import('../pages/assessment/AssessmentEnginePage').then(m => ({ default: m.AssessmentEnginePage })));
const RecommendationDashboardPage = lazy(() => import('../pages/assessment/RecommendationDashboardPage').then(m => ({ default: m.RecommendationDashboardPage })));

const ChatLayout = lazy(() => import('../layouts/ChatLayout').then(m => ({ default: m.ChatLayout })));
const MentorHomePage = lazy(() => import('../pages/mentor/MentorHomePage').then(m => ({ default: m.MentorHomePage })));
const ChatInterfacePage = lazy(() => import('../pages/mentor/ChatInterfacePage').then(m => ({ default: m.ChatInterfacePage })));

const ResourcesLayout = lazy(() => import('../layouts/ResourcesLayout').then(m => ({ default: m.ResourcesLayout })));
const ResourcesHomePage = lazy(() => import('../pages/resources/ResourcesHomePage').then(m => ({ default: m.ResourcesHomePage })));
const CategoryPage = lazy(() => import('../pages/resources/CategoryPage').then(m => ({ default: m.CategoryPage })));

const BuilderLayout = lazy(() => import('../layouts/BuilderLayout').then(m => ({ default: m.BuilderLayout })));
const ResumeDashboard = lazy(() => import('../pages/resume/ResumeDashboard').then(m => ({ default: m.ResumeDashboard })));
const ResumeBuilderPage = lazy(() => import('../pages/resume/ResumeBuilderPage').then(m => ({ default: m.ResumeBuilderPage })));
const PortfolioBuilderPage = lazy(() => import('../pages/resume/PortfolioBuilderPage').then(m => ({ default: m.PortfolioBuilderPage })));

const AdminLayout = lazy(() => import('../layouts/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const UserManagementPage = lazy(() => import('../pages/admin/users/UserManagementPage').then(m => ({ default: m.UserManagementPage })));
const ResourceManagementPage = lazy(() => import('../pages/admin/cms/ResourceManagementPage').then(m => ({ default: m.ResourceManagementPage })));

// --- Placeholder Pages ---
const NotFoundPage = () => <Box p={4}><Typography variant="h4">404 - Not Found</Typography></Box>;

// Wraps a component in Suspense
const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<LoadingScreen />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: 'login',
        element: withSuspense(LoginPage),
      },
      {
        path: 'register',
        element: withSuspense(RegisterPage),
      },
      {
        path: 'forgot-password',
        element: withSuspense(ForgotPasswordPage),
      },
      {
        path: 'reset-password/:token',
        element: withSuspense(ResetPasswordPage),
      },
      {
        path: 'session-expired',
        element: withSuspense(SessionExpiredPage),
      },
    ],
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute />,
    children: [
      {
        path: '',
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: withSuspense(DashboardOverviewPage),
          },
          {
            path: 'profile',
            element: withSuspense(ViewProfilePage),
          },
          {
            path: 'profile/edit',
            element: withSuspense(EditProfilePage),
          },
          {
            path: 'assessment',
            children: [
              { index: true, element: withSuspense(AssessmentLandingPage) },
              { path: 'take', element: withSuspense(AssessmentEnginePage) },
            ]
          },
          {
            path: 'recommendations',
            element: withSuspense(RecommendationDashboardPage),
          },
          {
            path: 'mentor',
            element: withSuspense(ChatLayout),
            children: [
              { index: true, element: withSuspense(MentorHomePage) },
              { path: 'c/:sessionId', element: withSuspense(ChatInterfacePage) }
            ]
          },
          {
            path: 'resources',
            element: withSuspense(ResourcesLayout),
            children: [
              { index: true, element: withSuspense(ResourcesHomePage) },
              { path: 'c', element: withSuspense(CategoryPage) }
            ]
          },
          { 
            path: 'resume', 
            element: withSuspense(ResumeDashboard) 
          }
        ],
      },
    ],
  },
  {
    path: '/builder',
    element: <ProtectedRoute />,
    children: [
      {
        path: '',
        element: withSuspense(BuilderLayout),
        children: [
          {
            path: 'resume/:id',
            element: withSuspense(ResumeBuilderPage),
          },
          {
            path: 'portfolio',
            element: withSuspense(PortfolioBuilderPage),
          },
        ],
      },
    ],
  },
  {
    path: '/admin',
    element: withSuspense(AdminLayout),
    children: [
      { index: true, element: withSuspense(AdminDashboardPage) },
      { path: 'users', element: withSuspense(UserManagementPage) },
      { path: 'cms', element: withSuspense(ResourceManagementPage) },
      { path: 'settings', element: <Box p={4}><Typography variant="h5">System Settings Placeholder</Typography></Box> }
    ]
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
