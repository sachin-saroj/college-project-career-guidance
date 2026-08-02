import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Dashboard } from "./pages/Dashboard";
import { PlaceholderPage } from "./pages/PlaceholderPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/assessment" element={<PlaceholderPage title="Career Assessment" />} />
          <Route path="/mentor" element={<PlaceholderPage title="AI Mentor" />} />
          <Route path="/resume" element={<PlaceholderPage title="Resume Builder" />} />
          <Route path="/resources" element={<PlaceholderPage title="Resources" />} />
          <Route path="/scholarships" element={<PlaceholderPage title="Scholarships" />} />
          <Route path="/internships" element={<PlaceholderPage title="Internships" />} />
          <Route path="/roadmaps" element={<PlaceholderPage title="Roadmaps" />} />
          <Route path="/profile" element={<PlaceholderPage title="Profile" />} />
          <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
          <Route path="*" element={<PlaceholderPage title="Page Not Found" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
