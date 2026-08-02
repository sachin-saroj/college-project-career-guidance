import { Search, Bell, Sun, Plus, Menu as MenuIcon, LogOut, Settings, User } from "lucide-react";
import { Button } from "../ui/Button";
import { Avatar } from "../ui/Avatar";
import { useAuth } from "../../context/AuthContext";
import { useUIStore } from "../../store/useUIStore";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";

export const TopNavbar = () => {
  const { user, logout } = useAuth();
  const { setCommandMenuOpen, toggleSidebar } = useUIStore();
  const navigate = useNavigate();
  
  return (
    <header className="h-72 px-32 flex items-center justify-between bg-background z-10 sticky top-0 border-b border-border/50">
      
      {/* Left / Menu & Search */}
      <div className="flex-1 max-w-2xl flex items-center gap-16">
        <Button variant="ghost" size="icon" className="md:hidden text-text-muted" onClick={toggleSidebar}>
          <MenuIcon size={24} />
        </Button>
        <button 
          onClick={() => setCommandMenuOpen(true)}
          className="hidden sm:flex items-center gap-8 bg-white/50 hover:bg-white border border-transparent hover:border-brand-primary/20 transition-all rounded-input px-12 py-10 w-full max-w-[400px] text-text-muted cursor-text"
        >
          <Search size={18} />
          <span className="flex-1 text-left text-[14px]">Search anything...</span>
          <div className="flex items-center gap-4">
            <kbd className="hidden md:inline-flex items-center justify-center rounded border border-border bg-gray-50 px-6 py-2 text-[10px] font-medium text-text-muted">⌘</kbd>
            <kbd className="hidden md:inline-flex items-center justify-center rounded border border-border bg-gray-50 px-6 py-2 text-[10px] font-medium text-text-muted">K</kbd>
          </div>
        </button>
      </div>

      {/* Right / Actions */}
      <div className="flex items-center gap-24 ml-32">
        <div className="flex items-center gap-16">
          <Button variant="outline" size="sm" className="hidden lg:flex gap-2 rounded-button h-40">
            <Plus size={16} />
            Add Task
          </Button>
          
          <div className="h-32 w-px bg-border mx-8" />
          
          <Button variant="ghost" size="icon" className="relative text-text-muted hover:bg-gray-100">
            <Bell size={20} />
            <span className="absolute top-[8px] right-[8px] h-2 w-2 rounded-full bg-status-danger border-2 border-background" />
          </Button>

          <Button variant="ghost" size="icon" className="text-text-muted hover:bg-gray-100">
            <Sun size={20} />
          </Button>
        </div>

        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="flex items-center gap-12 cursor-pointer outline-none rounded-full ring-2 ring-transparent hover:ring-brand-primary/20 transition-all focus-visible:ring-brand-primary">
            <div className="text-right hidden md:block">
              <p className="text-small font-semibold text-text-main leading-none">
                {user ? user.name : "Guest"}
              </p>
              <p className="text-[11px] text-text-muted mt-1">{user ? user.role : "Student"}</p>
            </div>
            <Avatar 
              initials={user ? user.name.substring(0, 2).toUpperCase() : "G"} 
              src={user ? `https://ui-avatars.com/api/?name=${user.name}&background=random` : undefined} 
              className="ring-2 ring-transparent"
            />
          </Menu.Button>
          
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-8 w-56 origin-top-right rounded-xl bg-white shadow-lift ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden z-50">
              <div className="py-4">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => navigate("/profile")}
                      className={`${
                        active ? "bg-gray-50 text-text-main" : "text-text-muted"
                      } group flex w-full items-center px-16 py-12 text-sm font-medium transition-colors`}
                    >
                      <User size={16} className="mr-12 text-text-muted group-hover:text-brand-primary" />
                      View Profile
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => navigate("/settings")}
                      className={`${
                        active ? "bg-gray-50 text-text-main" : "text-text-muted"
                      } group flex w-full items-center px-16 py-12 text-sm font-medium transition-colors`}
                    >
                      <Settings size={16} className="mr-12 text-text-muted group-hover:text-brand-primary" />
                      Settings
                    </button>
                  )}
                </Menu.Item>
                <div className="h-px bg-border my-4" />
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={logout}
                      className={`${
                        active ? "bg-red-50 text-status-danger" : "text-status-danger/80"
                      } group flex w-full items-center px-16 py-12 text-sm font-medium transition-colors`}
                    >
                      <LogOut size={16} className="mr-12 text-status-danger/60 group-hover:text-status-danger" />
                      Log out
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </header>
  );
};
