import { NavLink } from "react-router-dom";
import { cn } from "../../utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "../../store/useUIStore";
import { Logo } from "../ui/Logo";
import { 
  LayoutDashboard, 
  Target, 
  Bot, 
  FileText, 
  BookOpen, 
  Map, 
  User, 
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/" },
  { name: "Career Assessment", icon: Target, path: "/assessment" },
  { name: "AI Mentor", icon: Bot, path: "/mentor", badge: "AI" },
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

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isSidebarCollapsed ? 76 : 260 }}
      transition={{ type: "spring", bounce: 0, duration: 0.35 }}
      className="h-screen sticky top-0 bg-white dark:bg-[#101114] border-r border-[#e5e7eb] dark:border-[#22242b] flex flex-col justify-between hidden md:flex shrink-0 z-20"
    >
      <div className={cn("flex-1 overflow-y-auto py-6 scrollbar-hide flex flex-col", isSidebarCollapsed ? "px-2" : "px-4")}>
        {/* 100x Enhanced Brand Logo */}
        <div className={cn("mb-6 h-16 flex items-center shrink-0 w-full", isSidebarCollapsed ? "justify-center px-0" : "px-2.5")}>
          <Logo collapsed={isSidebarCollapsed} size="md" />
        </div>

        {/* Section Label */}
        {!isSidebarCollapsed && (
          <div className="px-3 pt-4 pb-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-slate">Platform Navigation</span>
          </div>
        )}

        {/* Navigation */}
        <nav className="space-y-1.5 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              title={isSidebarCollapsed ? item.name : undefined}
              className={({ isActive }) => cn(
                "flex items-center h-10 rounded-md text-[14px] font-medium transition-all duration-150 relative group overflow-hidden",
                isSidebarCollapsed ? "justify-center px-0" : "px-3 gap-3",
                isActive 
                  ? "bg-[#eeece7] text-[#17171c] font-semibold" 
                  : "text-slate hover:bg-[#f7f7f6] hover:text-ink"
              )}
            >
              <item.icon size={18} className="shrink-0" />
              <AnimatePresence>
                {!isSidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap flex-1"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>

              {!isSidebarCollapsed && item.badge && (
                <span className="font-mono text-[10px] bg-[#003c33] text-white px-1.5 py-0.5 rounded uppercase">
                  {item.badge}
                </span>
              )}
              
              {/* Tooltip for collapsed state */}
              {isSidebarCollapsed && (
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#17171c] text-white text-xs rounded shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none font-mono">
                  {item.name}
                </div>
              )}
            </NavLink>
          ))}

          <div className="py-3">
            <div className="h-px w-full bg-[#e5e7eb]" />
          </div>

          {!isSidebarCollapsed && (
            <div className="px-3 pb-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate">User Account</span>
            </div>
          )}

          {secondaryNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              title={isSidebarCollapsed ? item.name : undefined}
              className={({ isActive }) => cn(
                "flex items-center h-10 rounded-md text-[14px] font-medium transition-all duration-150 relative group overflow-hidden",
                isSidebarCollapsed ? "justify-center px-0" : "px-3 gap-3",
                isActive 
                  ? "bg-[#eeece7] text-[#17171c] font-semibold" 
                  : "text-slate hover:bg-[#f7f7f6] hover:text-ink"
              )}
            >
              <item.icon size={18} className="shrink-0" />
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

              {isSidebarCollapsed && (
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#17171c] text-white text-xs rounded shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none font-mono">
                  {item.name}
                </div>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Collapse Toggle Button */}
      <div className="p-3 border-t border-[#e5e7eb]">
        <button 
          onClick={toggleSidebar}
          className="flex items-center justify-center h-[32px] w-full text-slate hover:text-ink transition-colors bg-[#eeece7]/50 hover:bg-[#eeece7] rounded-md border border-[#d9d9dd]"
        >
          {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </motion.aside>
  );
};

