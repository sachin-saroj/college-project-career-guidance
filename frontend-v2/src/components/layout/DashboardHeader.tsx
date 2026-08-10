import { useAuth } from "../../context/AuthContext";

export const DashboardHeader = () => {
  const { user } = useAuth();
  
  return (
    <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#e5e7eb] pb-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-[11px] uppercase tracking-widest text-[#003c33] bg-[#edfce9] px-2 py-0.5 rounded">
            STUDENT CONSOLE
          </span>
          <span className="font-mono text-[11px] text-slate">
            • {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-normal text-ink tracking-tight mb-1">
          Welcome back, {user ? user.name.split(" ")[0] : "Student"}.
        </h1>
        <p className="text-slate text-[15px]">
          AI-guided insights, career roadmaps, and active recommendations.
        </p>
      </div>
    </div>
  );
};

