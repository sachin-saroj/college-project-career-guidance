import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Route-level Code Splitting (React.lazy) for Optimal Bundle Optimization
const Dashboard = lazy(() => import("./pages/Dashboard").then(m => ({ default: m.Dashboard })));
const Assessment = lazy(() => import("./pages/Assessment").then(m => ({ default: m.Assessment })));
const Mentor = lazy(() => import("./pages/Mentor").then(m => ({ default: m.Mentor })));
const ResumeBuilder = lazy(() => import("./pages/ResumeBuilder").then(m => ({ default: m.ResumeBuilder })));
const ResourcesHub = lazy(() => import("./pages/Resources/ResourcesHub").then(m => ({ default: m.ResourcesHub })));
const RoadmapsPage = lazy(() => import("./pages/Roadmaps/RoadmapsPage").then(m => ({ default: m.RoadmapsPage })));
const AdminDashboard = lazy(() => import("./pages/Admin").then(m => ({ default: m.AdminDashboard })));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const Login = lazy(() => import("./pages/Auth/Login"));
const Signup = lazy(() => import("./pages/Auth/Signup"));

const queryClient = new QueryClient();

const pageTitles: Record<string, string> = {
  "/": "Dashboard | CareerSathi",
  "/assessment": "Career Assessment & Diagnostic | CareerSathi",
  "/mentor": "AI Career Mentor | CareerSathi",
  "/resume": "ATS Resume Builder | CareerSathi",
  "/resources": "Scholarships & Resource Hub | CareerSathi",
  "/scholarships": "Verified Scholarships | CareerSathi",
  "/internships": "Internships & Opportunities | CareerSathi",
  "/roadmaps": "Career Learning Roadmaps | CareerSathi",
  "/profile": "Student Profile | CareerSathi",
  "/settings": "Account & Preferences | CareerSathi",
  "/login": "Sign In | CareerSathi",
  "/signup": "Create Student Account | CareerSathi",
  "/admin": "Admin Console | CareerSathi",
};

function PageTitleManager() {
  const location = useLocation();

  useEffect(() => {
    const title = pageTitles[location.pathname] || "CareerSathi | AI Career Guidance Platform";
    document.title = title;
  }, [location.pathname]);

  return null;
}

const PageLoader = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-[#f7f7f6]">
    <div className="flex flex-col items-center gap-3 font-mono text-xs text-slate">
      <div className="w-8 h-8 rounded-full border-2 border-[#003c33] border-t-transparent animate-spin" />
      <span>LOADING CAREERSATHI CONSOLE...</span>
    </div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <PageTitleManager />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/assessment" element={<Assessment />} />
                <Route path="/mentor" element={<Mentor />} />
                <Route path="/resume" element={<ResumeBuilder />} />
                <Route path="/resources" element={<ResourcesHub defaultCategory="All" />} />
                <Route path="/scholarships" element={<ResourcesHub defaultCategory="Scholarships" />} />
                <Route path="/internships" element={<ResourcesHub defaultCategory="Internships" />} />
                <Route path="/roadmaps" element={<RoadmapsPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

              <Route element={<ProtectedRoute requireAdmin={true} />}>
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
