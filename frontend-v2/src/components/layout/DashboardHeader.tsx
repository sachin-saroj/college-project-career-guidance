import { useAuth } from "../../context/AuthContext";

export const DashboardHeader = () => {
  const { user } = useAuth();
  
  return (
    <div className="mb-40 flex flex-col md:flex-row md:items-end justify-between gap-16">
      <div>
        <p className="text-text-muted text-body mb-4 flex items-center gap-2">
          Hello, {user ? user.name.split(" ")[0] : "Guest"}! <span className="text-xl">👋</span>
        </p>
        <h1 className="text-h2 text-text-main mb-8">Welcome back</h1>
        <p className="text-body text-text-muted">
          Let's continue your career journey
        </p>
      </div>
    </div>
  );
};
