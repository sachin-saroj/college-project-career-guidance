import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";
import { CommandMenu } from "./CommandMenu";
import { motion } from "framer-motion";

export const PageWrapper = ({ children }: { children: ReactNode }) => {

  return (
    <div className="min-h-screen bg-canvas dark:bg-[#090a0c] text-ink dark:text-[#f3f4f6] flex">
      <Sidebar />
      <motion.div 
        layout
        className="flex-1 flex flex-col relative w-full min-w-0"
      >
        <TopNavbar />
        <main role="main" aria-label="Main Content Area" className="flex-1 p-24 md:p-40 max-w-[1440px] w-full mx-auto overflow-x-hidden">
          {children}
        </main>
      </motion.div>
      <CommandMenu />
    </div>
  );
};
