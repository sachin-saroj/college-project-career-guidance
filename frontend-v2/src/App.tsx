import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Dashboard } from "./pages/Dashboard";
import { Assessment } from "./pages/Assessment";
import { Mentor } from "./pages/Mentor";
import { ResumeBuilder } from "./pages/ResumeBuilder";
import { ResourcesHub } from "./pages/Resources/ResourcesHub";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import { AdminDashboard } from "./pages/Admin";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
      <Router>
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
            <Route path="/roadmaps" element={<ResourcesHub defaultCategory="Roadmaps" />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          <Route element={<ProtectedRoute requireAdmin={true} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
          
          <Route path="*" element={<PlaceholderPage title="Page Not Found" />} />
        </Routes>
      </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
