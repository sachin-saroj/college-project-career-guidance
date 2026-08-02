import { useEffect } from "react";
import { Command } from "cmdk";
import { useNavigate } from "react-router-dom";
import { useUIStore } from "../../store/useUIStore";
import { Dialog, Transition } from "@headlessui/react";
import { Search, LayoutDashboard, Target, Bot, FileText, Settings, User } from "lucide-react";
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
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" />
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
            <Dialog.Panel className="mx-auto max-w-xl transform divide-y divide-border overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
              <Command className="flex flex-col w-full h-full text-text-main bg-white" label="Global Command Menu">
                <div className="flex items-center px-16 border-b border-border">
                  <Search size={18} className="text-text-muted shrink-0 mr-12" />
                  <Command.Input 
                    autoFocus 
                    placeholder="Type a command or search..." 
                    className="h-56 flex-1 bg-transparent text-[15px] outline-none placeholder:text-text-muted text-text-main"
                  />
                  <div className="text-[10px] bg-gray-100 px-6 py-2 rounded text-text-muted font-medium ml-12">ESC</div>
                </div>

                <Command.List className="max-h-[300px] overflow-y-auto p-8 scrollbar-hide">
                  <Command.Empty className="py-24 text-center text-text-muted text-small">
                    No results found.
                  </Command.Empty>

                  <Command.Group heading="Navigation" className="text-xs font-semibold text-text-muted px-8 py-4 [&_[cmdk-group-heading]]:mb-8 [&_[cmdk-group-heading]]:text-text-muted">
                    <Command.Item 
                      onSelect={() => runCommand(() => navigate("/"))}
                      className="flex items-center gap-12 px-12 py-12 rounded-lg cursor-pointer aria-selected:bg-brand-light aria-selected:text-brand-primary text-body"
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Command.Item>
                    <Command.Item 
                      onSelect={() => runCommand(() => navigate("/assessment"))}
                      className="flex items-center gap-12 px-12 py-12 rounded-lg cursor-pointer aria-selected:bg-brand-light aria-selected:text-brand-primary text-body"
                    >
                      <Target size={16} />
                      Career Assessment
                    </Command.Item>
                    <Command.Item 
                      onSelect={() => runCommand(() => navigate("/mentor"))}
                      className="flex items-center gap-12 px-12 py-12 rounded-lg cursor-pointer aria-selected:bg-brand-light aria-selected:text-brand-primary text-body"
                    >
                      <Bot size={16} />
                      Chat with AI Mentor
                    </Command.Item>
                    <Command.Item 
                      onSelect={() => runCommand(() => navigate("/resume"))}
                      className="flex items-center gap-12 px-12 py-12 rounded-lg cursor-pointer aria-selected:bg-brand-light aria-selected:text-brand-primary text-body"
                    >
                      <FileText size={16} />
                      Resume Builder
                    </Command.Item>
                  </Command.Group>

                  <Command.Group heading="Account" className="text-xs font-semibold text-text-muted px-8 py-4 mt-8 [&_[cmdk-group-heading]]:mb-8 [&_[cmdk-group-heading]]:text-text-muted border-t border-border pt-12">
                    <Command.Item 
                      onSelect={() => runCommand(() => navigate("/profile"))}
                      className="flex items-center gap-12 px-12 py-12 rounded-lg cursor-pointer aria-selected:bg-gray-100 text-body"
                    >
                      <User size={16} />
                      View Profile
                    </Command.Item>
                    <Command.Item 
                      onSelect={() => runCommand(() => navigate("/settings"))}
                      className="flex items-center gap-12 px-12 py-12 rounded-lg cursor-pointer aria-selected:bg-gray-100 text-body"
                    >
                      <Settings size={16} />
                      Settings
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
