import { PageWrapper } from "../../components/layout/PageWrapper";
import { ChatSidebar } from "./ChatSidebar";
import { ChatArea } from "./ChatArea";
import { ContextPanel } from "./ContextPanel";
import { useUIStore } from "../../store/useUIStore";
import { useEffect } from "react";

export const Mentor = () => {
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();

  // Close the main app sidebar on desktop for maximum chat space
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && !isSidebarCollapsed) {
        toggleSidebar();
      }
    };
    
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebarCollapsed, toggleSidebar]);

  return (
    <PageWrapper>
      <div className="flex h-full w-full overflow-hidden rounded-xl border shadow-sm bg-white">
        <ChatSidebar />
        <ChatArea onMenuClick={toggleSidebar} />
        <ContextPanel />
      </div>
    </PageWrapper>
  );
};
