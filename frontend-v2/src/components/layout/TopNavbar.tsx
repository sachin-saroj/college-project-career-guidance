import { useState, Fragment } from "react";
import { Search, Bell, Plus, Menu as MenuIcon, LogOut, Settings, User } from "lucide-react";
import { Button } from "../ui/Button";
import { Avatar } from "../ui/Avatar";
import { useAuth } from "../../context/AuthContext";
import { useUIStore } from "../../store/useUIStore";
import { Menu, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { QuickActionModal } from "./QuickActionModal";
import { NotificationDrawer } from "./NotificationDrawer";

export const TopNavbar = () => {
  const { user, logout } = useAuth();
  const { setCommandMenuOpen, toggleSidebar } = useUIStore();
  const navigate = useNavigate();

  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  
  return (
    <header role="banner" aria-label="Top Navigation Header" className="h-[64px] px-6 py-3 flex items-center justify-between bg-white dark:bg-[#101114] sticky top-0 z-10 border-b border-[#e5e7eb] dark:border-[#22242b]">
      
      {/* Zone 1 / Left: Menu & Search */}
      <div className="flex-1 max-w-xl flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden text-slate" onClick={toggleSidebar}>
          <MenuIcon size={20} />
        </Button>
        <button 
          onClick={() => setCommandMenuOpen(true)}
          className="hidden sm:flex items-center gap-3 bg-[#f7f7f6] hover:bg-[#eeece7] border border-[#d9d9dd] transition-all rounded-md px-3.5 py-1.5 w-full max-w-[360px] text-slate cursor-text text-left"
        >
          <Search size={16} className="text-slate shrink-0" />
          <span className="flex-1 text-[13px]">Search assessment, mentor, resources...</span>
          <div className="flex items-center gap-1 font-mono text-[10px] bg-white border border-[#d9d9dd] px-1.5 py-0.5 rounded text-slate">
            ⌘K
          </div>
        </button>
      </div>

      {/* Zone 3 / Right: Actions & User Dropdown */}
      <div className="flex items-center gap-4 ml-6">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsQuickActionOpen(true)}
            className="hidden sm:flex gap-1.5 text-[13px] font-mono hover:border-[#17171c]"
          >
            <Plus size={14} />
            Quick Action
          </Button>
          
          <div className="h-6 w-px bg-[#e5e7eb] mx-1" />
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsNotificationDrawerOpen(true)}
            className="relative text-slate hover:text-ink"
            title="System Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-coral animate-pulse" />
            )}
          </Button>
        </div>

        <Menu as="div" className="relative inline-block text-left ml-2">
          <Menu.Button className="flex items-center gap-3 cursor-pointer outline-none rounded-full p-1 hover:bg-[#f7f7f6] transition-all">
            <div className="text-right hidden md:block">
              <p className="text-[14px] font-medium text-ink leading-tight">
                {user ? user.name : "Guest Student"}
              </p>
              <p className="font-mono text-[10px] text-slate uppercase tracking-wider">{user ? user.role : "Student"}</p>
            </div>
            <Avatar 
              initials={user ? user.name.substring(0, 2).toUpperCase() : "G"} 
              src={user ? `https://ui-avatars.com/api/?name=${user.name}&background=17171c&color=ffffff` : undefined} 
              className="h-[32px] w-[32px] text-xs font-mono"
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
            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white border border-[#e5e7eb] shadow-lift focus:outline-none overflow-hidden z-50 p-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => navigate("/profile")}
                    className={`${
                      active ? "bg-[#eeece7] text-ink" : "text-slate"
                    } group flex w-full items-center px-3 py-2 text-sm rounded-md font-medium transition-colors`}
                  >
                    <User size={16} className="mr-3 text-slate group-hover:text-ink" />
                    View Profile
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => navigate("/settings")}
                    className={`${
                      active ? "bg-[#eeece7] text-ink" : "text-slate"
                    } group flex w-full items-center px-3 py-2 text-sm rounded-md font-medium transition-colors`}
                  >
                    <Settings size={16} className="mr-3 text-slate group-hover:text-ink" />
                    Settings
                  </button>
                )}
              </Menu.Item>
              <div className="h-px bg-[#e5e7eb] my-1" />
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={logout}
                    className={`${
                      active ? "bg-[#b30000]/10 text-[#b30000]" : "text-[#b30000]"
                    } group flex w-full items-center px-3 py-2 text-sm rounded-md font-medium transition-colors`}
                  >
                    <LogOut size={16} className="mr-3" />
                    Sign out
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      {/* Quick Action Modal */}
      <QuickActionModal 
        isOpen={isQuickActionOpen} 
        onClose={() => setIsQuickActionOpen(false)} 
      />

      {/* Notification Drawer */}
      <NotificationDrawer 
        isOpen={isNotificationDrawerOpen} 
        onClose={() => setIsNotificationDrawerOpen(false)} 
        onNotificationsReadChange={(count) => setUnreadCount(count)}
      />
    </header>
  );
};
