import { PageWrapper } from "../../components/layout/PageWrapper";
import { ChatSidebar } from "./ChatSidebar";
import { ChatArea } from "./ChatArea";
import { ContextPanel } from "./ContextPanel";
import { useChatStore } from "../../store/useChatStore";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Mentor = () => {
  const { chats, activeChatId, createChat, isContextPanelOpen, toggleContextPanel } = useChatStore();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileContextOpen, setIsMobileContextOpen] = useState(false);

  // Auto initialize first chat if store is empty
  useEffect(() => {
    if (!activeChatId && chats.length === 0) {
      createChat();
    }
  }, [activeChatId, chats.length, createChat]);

  const handleToggleContext = () => {
    if (window.innerWidth < 1024) {
      setIsMobileContextOpen((prev) => !prev);
    } else {
      toggleContextPanel();
    }
  };

  return (
    <PageWrapper>
      <div className="relative flex h-[calc(100vh-120px)] sm:h-[calc(100vh-100px)] w-full overflow-hidden rounded-2xl md:rounded-[22px] border border-[#d9d9dd] shadow-sm bg-white">
        {/* Desktop Sidebar (inline, hidden on mobile) */}
        <ChatSidebar />

        {/* Mobile Sessions Drawer with Backdrop */}
        <AnimatePresence>
          {isMobileSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileSidebarOpen(false)}
                className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 250 }}
                className="fixed top-0 bottom-0 left-0 w-80 max-w-[85vw] bg-[#f7f7f6] z-50 md:hidden shadow-2xl flex flex-col"
              >
                <ChatSidebar isMobileDrawer onCloseMobile={() => setIsMobileSidebarOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Responsive Chat Area */}
        <ChatArea
          onToggleSidebar={() => setIsMobileSidebarOpen(true)}
          onToggleContext={handleToggleContext}
          isContextOpen={isContextPanelOpen || isMobileContextOpen}
        />

        {/* Desktop Context Panel */}
        <ContextPanel />

        {/* Mobile Context Drawer with Backdrop */}
        <AnimatePresence>
          {isMobileContextOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileContextOpen(false)}
                className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs"
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 250 }}
                className="fixed top-0 bottom-0 right-0 w-80 max-w-[85vw] bg-[#f7f7f6] z-50 lg:hidden shadow-2xl flex flex-col"
              >
                <ContextPanel isMobileDrawer onCloseMobile={() => setIsMobileContextOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
};
