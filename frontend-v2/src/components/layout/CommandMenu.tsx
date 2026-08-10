import { useEffect } from "react";
import { Command } from "cmdk";
import { useNavigate } from "react-router-dom";
import { useUIStore } from "../../store/useUIStore";
import { Dialog, Transition } from "@headlessui/react";
import { 
  Search, 
  LayoutDashboard, 
  Target, 
  Bot, 
  FileText, 
  Settings, 
  User, 
  BookOpen, 
  Map, 
  GraduationCap, 
  Briefcase, 
  Lock
} from "lucide-react";
import { Fragment } from "react";

export const CommandMenu = () => {
  const { isCommandMenuOpen, setCommandMenuOpen } = useUIStore();
  const navigate = useNavigate();

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandMenuOpen(!isCommandMenuOpen);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isCommandMenuOpen, setCommandMenuOpen]);

  const runCommand = (command: () => void) => {
    setCommandMenuOpen(false);
    command();
  };

  return (
    <Transition.Root show={isCommandMenuOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setCommandMenuOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-xl transform divide-y divide-[#e5e7eb] overflow-hidden rounded-2xl bg-white shadow-2xl border border-[#d9d9dd] transition-all">
              <Command className="flex flex-col w-full h-full text-ink bg-white" label="Global Command Menu">
                <div className="flex items-center px-4 border-b border-[#e5e7eb] bg-[#f7f7f6]">
                  <Search size={18} className="text-slate shrink-0 mr-3" />
                  <Command.Input 
                    autoFocus 
                    placeholder="Search pages, roadmaps, scholarships, or settings..." 
                    className="h-12 flex-1 bg-transparent text-xs font-sans outline-none placeholder:text-slate text-ink"
                  />
                  <div className="text-[10px] bg-white border border-[#d9d9dd] px-2 py-0.5 rounded text-slate font-mono ml-3">ESC</div>
                </div>

                <Command.List className="max-h-[350px] overflow-y-auto p-3 scrollbar-hide space-y-2">
                  <Command.Empty className="py-8 text-center text-slate font-mono text-xs">
                    No matching pages or tools found.
                  </Command.Empty>

                  <Command.Group heading="Workspace Navigation" className="text-[10px] font-mono uppercase tracking-wider text-slate px-3 py-1 font-semibold">
                    <Command.Item 
                      onSelect={() => runCommand(() => navigate("/"))}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-[#f7f7f6] aria-selected:bg-[#eeece7] text-xs font-medium text-ink"
                    >
                      <LayoutDashboard size={16} className="text-[#003c33]" />
                      Dashboard
                    </Command.Item>

                    <Command.Item 
                      onSelect={() => runCommand(() => navigate("/assessment"))}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-[#f7f7f6] aria-selected:bg-[#eeece7] text-xs font-medium text-ink"
                    >
                      <Target size={16} className="text-[#003c33]" />
                      Career Assessment
                    </Command.Item>

                    <Command.Item 
                      onSelect={() => runCommand(() => navigate("/mentor"))}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-[#f7f7f6] aria-selected:bg-[#eeece7] text-xs font-medium text-ink"
                    >
                      <Bot size={16} className="text-[#003c33]" />
                      Chat with AI Mentor
                    </Command.Item>

                    <Command.Item 
                      onSelect={() => runCommand(() => navigate("/resume"))}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-[#f7f7f6] aria-selected:bg-[#eeece7] text-xs font-medium text-ink"
                    >
                      <FileText size={16} className="text-[#003c33]" />
                      Resume Builder
                    </Command.Item>

                    <Command.Item 
                      onSelect={() => runCommand(() => navigate("/roadmaps"))}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-[#f7f7f6] aria-selected:bg-[#eeece7] text-xs font-medium text-ink"
                    >
                      <Map size={16} className="text-[#003c33]" />
                      Career Roadmaps Hub (CA, UPSC, Law, Nursing, Trades)
                    </Command.Item>

                    <Command.Item 
                      onSelect={() => runCommand(() => navigate("/resources"))}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-[#f7f7f6] aria-selected:bg-[#eeece7] text-xs font-medium text-ink"
                    >
                      <BookOpen size={16} className="text-[#003c33]" />
                      Curated Knowledge & Opportunities
                    </Command.Item>

                    <Command.Item 
                      onSelect={() => runCommand(() => navigate("/scholarships"))}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-[#f7f7f6] aria-selected:bg-[#eeece7] text-xs font-medium text-ink"
                    >
                      <GraduationCap size={16} className="text-[#003c33]" />
                      Scholarships (Reliance, NSP, HDFC)
                    </Command.Item>

                    <Command.Item 
                      onSelect={() => runCommand(() => navigate("/internships"))}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-[#f7f7f6] aria-selected:bg-[#eeece7] text-xs font-medium text-ink"
                    >
                      <Briefcase size={16} className="text-[#003c33]" />
                      Internships (NITI Aayog, Growth Capital, Media)
                    </Command.Item>
                  </Command.Group>

                  <Command.Group heading="Account & System Settings" className="text-[10px] font-mono uppercase tracking-wider text-slate px-3 py-1 mt-2 border-t border-[#e5e7eb] pt-2 font-semibold">
                    <Command.Item 
                      onSelect={() => runCommand(() => navigate("/profile"))}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-[#f7f7f6] aria-selected:bg-[#eeece7] text-xs font-medium text-ink"
                    >
                      <User size={16} />
                      View Profile
                    </Command.Item>

                    <Command.Item 
                      onSelect={() => runCommand(() => navigate("/settings"))}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-[#f7f7f6] aria-selected:bg-[#eeece7] text-xs font-medium text-ink"
                    >
                      <Settings size={16} />
                      Settings (Appearance & Security)
                    </Command.Item>

                    <Command.Item 
                      onSelect={() => runCommand(() => navigate("/settings"))}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-[#f7f7f6] aria-selected:bg-[#eeece7] text-xs font-medium text-ink"
                    >
                      <Lock size={16} className="text-coral" />
                      Unlock System Admin Console (Passkey: TILAK-PRO)
                    </Command.Item>
                  </Command.Group>
                </Command.List>
              </Command>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
