import { NavLink } from "react-router-dom";
import { cn } from "../../utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "../../store/useUIStore";
import { useAuth } from "../../context/AuthContext";
import { 
  LayoutDashboard, 
  Target, 
  Bot, 
  FileText, 
  BookOpen, 
  Map, 
  User, 
  Settings,
  GraduationCap,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/" },
  { name: "Career Assessment", icon: Target, path: "/assessment" },
  { name: "AI Mentor", icon: Bot, path: "/mentor" },
  { name: "Resume Builder", icon: FileText, path: "/resume" },
  { name: "Resources", icon: BookOpen, path: "/resources" },
  { name: "Roadmaps", icon: Map, path: "/roadmaps" },
];

const secondaryNavItems = [
  { name: "Profile", icon: User, path: "/profile" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

export const Sidebar = () => {
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();
  const { user } = useAuth();

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isSidebarCollapsed ? 80 : 280 }}
      transition={{ type: "spring", bounce: 0, duration: 0.4 }}
      className="h-screen sticky top-0 bg-brand-sidebar border-r border-border flex flex-col justify-between hidden md:flex shrink-0 z-20"
    >
      <div className="flex-1 overflow-y-auto py-24 px-16 scrollbar-hide flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-40 px-8 h-40">
          <div className="h-40 w-40 min-w-[40px] rounded-xl bg-brand-primary flex items-center justify-center text-white shadow-lift shrink-0">
            <GraduationCap size={24} />
          </div>
          <AnimatePresence>
            {!isSidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <h1 className="text-[20px] font-bold text-text-main leading-none">CareerSathi</h1>
                <p className="text-small text-text-muted mt-1">Guiding Your Future</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="space-y-4 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              title={isSidebarCollapsed ? item.name : undefined}
              className={({ isActive }) => cn(
                "flex items-center h-48 rounded-input text-body font-medium transition-all duration-250 relative group overflow-hidden",
                isSidebarCollapsed ? "justify-center px-0" : "px-16 gap-3",
                isActive 
                  ? "bg-brand-light text-brand-primary" 
                  : "text-text-muted hover:bg-gray-100/50 hover:text-text-main"
              )}
            >
              <item.icon size={20} className="shrink-0" />
              <AnimatePresence>
                {!isSidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
              
              {/* Tooltip for collapsed state (CSS-based) */}
              {isSidebarCollapsed && (
                <div className="absolute left-full ml-16 px-12 py-6 bg-text-main text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none">
                  {item.name}
                </div>
              )}
            </NavLink>
          ))}

          <div className="pt-16 pb-4">
            <div className="h-px w-full bg-border" />
          </div>

          {secondaryNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              title={isSidebarCollapsed ? item.name : undefined}
              className={({ isActive }) => cn(
                "flex items-center h-48 rounded-input text-body font-medium transition-all duration-250 relative group overflow-hidden",
                isSidebarCollapsed ? "justify-center px-0" : "px-16 gap-3",
                isActive 
                  ? "bg-brand-light text-brand-primary" 
                  : "text-text-muted hover:bg-gray-100/50 hover:text-text-main"
              )}
            >
              <item.icon size={20} className="shrink-0" />
              <AnimatePresence>
                {!isSidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Tooltip for collapsed state (CSS-based) */}
              {isSidebarCollapsed && (
                <div className="absolute left-full ml-16 px-12 py-6 bg-text-main text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none">
                  {item.name}
                </div>
              )}
            </NavLink>
          ))}

          {user?.role === "admin" && (
            <>
              <div className="pt-16 pb-4">
                <div className="h-px w-full bg-border" />
              </div>
              <NavLink
                to="/admin"
                title={isSidebarCollapsed ? "Admin" : undefined}
                className={({ isActive }) => cn(
                  "flex items-center h-48 rounded-input text-body font-medium transition-all duration-250 relative group overflow-hidden",
                  isSidebarCollapsed ? "justify-center px-0" : "px-16 gap-3",
                  isActive 
                    ? "bg-brand-light text-brand-primary" 
                    : "text-text-muted hover:bg-gray-100/50 hover:text-text-main"
                )}
              >
                <Settings size={20} className="shrink-0" />
                <AnimatePresence>
                  {!isSidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="whitespace-nowrap"
                    >
                      Admin
                    </motion.span>
                  )}
                </AnimatePresence>

                {isSidebarCollapsed && (
                  <div className="absolute left-full ml-16 px-12 py-6 bg-text-main text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none">
                    Admin
                  </div>
                )}
              </NavLink>
            </>
          )}
        </nav>
      </div>

      {/* Toggle */}
      <div className="p-16 flex flex-col gap-16">
        <button 
          onClick={toggleSidebar}
          className="flex items-center justify-center h-32 w-full text-text-muted hover:text-text-main transition-colors bg-gray-50 hover:bg-gray-100 rounded-md border border-border"
        >
          {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </motion.aside>
  );
};
