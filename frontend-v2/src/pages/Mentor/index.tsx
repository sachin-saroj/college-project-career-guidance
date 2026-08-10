import { PageWrapper } from "../../components/layout/PageWrapper";
import { ChatSidebar } from "./ChatSidebar";
import { ChatArea } from "./ChatArea";
import { ContextPanel } from "./ContextPanel";
import { useUIStore } from "../../store/useUIStore";
import { useEffect } from "react";

export const Mentor = () => {
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && !isSidebarCollapsed) {
        toggleSidebar();
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebarCollapsed, toggleSidebar]);

  return (
    <PageWrapper>
      <div className="flex h-[calc(100vh-100px)] w-full overflow-hidden rounded-[22px] border border-[#d9d9dd] shadow-sm bg-white">
        <ChatSidebar />
        <ChatArea onMenuClick={toggleSidebar} />
        <ContextPanel />
      </div>
    </PageWrapper>
  );
};

