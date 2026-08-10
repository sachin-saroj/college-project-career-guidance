import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Bell, 
  X, 
  CheckCheck, 
  GraduationCap, 
  Bot, 
  Map, 
  FileText
} from "lucide-react";
import { Button } from "../ui/Button";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "scholarship" | "mentor" | "roadmap" | "resume";
  read: boolean;
  link: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    title: "Reliance Foundation Scholarship Open",
    description: "Applications open for ₹2,00,000 undergraduate scholarship across all streams.",
    time: "10m ago",
    type: "scholarship",
    read: false,
    link: "/scholarships"
  },
  {
    id: "2",
    title: "AI Mentor Guidance Ready",
    description: "AI Advisor has generated updated career strategy recommendations for your profile.",
    time: "1h ago",
    type: "mentor",
    read: false,
    link: "/mentor"
  },
  {
    id: "3",
    title: "New Roadmaps Published",
    description: "Structured pathways for CA, UPSC, Nursing, and Skilled Trades are now available.",
    time: "3h ago",
    type: "roadmap",
    read: false,
    link: "/roadmaps"
  },
  {
    id: "4",
    title: "ATS Resume Builder Ready",
    description: "Scan your resume against live job descriptions to optimize ATS match scores.",
    time: "1d ago",
    type: "resume",
    read: true,
    link: "/resume"
  }
];

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNotificationsReadChange?: (unreadCount: number) => void;
}

export const NotificationDrawer = ({ isOpen, onClose, onNotificationsReadChange }: NotificationDrawerProps) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    if (onNotificationsReadChange) onNotificationsReadChange(0);
  };

  const handleItemClick = (item: NotificationItem) => {
    const updated = notifications.map(n => n.id === item.id ? { ...n, read: true } : n);
    setNotifications(updated);
    const newUnread = updated.filter(n => !n.read).length;
    if (onNotificationsReadChange) onNotificationsReadChange(newUnread);
    onClose();
    navigate(item.link);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "scholarship": return <GraduationCap size={18} className="text-[#003c33]" />;
      case "mentor": return <Bot size={18} className="text-[#003c33]" />;
      case "roadmap": return <Map size={18} className="text-[#003c33]" />;
      default: return <FileText size={18} className="text-[#003c33]" />;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full max-w-sm bg-white h-full shadow-2xl border-l border-[#d9d9dd] flex flex-col z-10"
        >
          {/* Header */}
          <div className="p-5 border-b border-[#e5e7eb] bg-[#17171c] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-white" />
              <h3 className="font-display text-base font-normal text-white">System Notifications</h3>
              {unreadCount > 0 && (
                <span className="font-mono text-[10px] bg-[#003c33] text-white px-2 py-0.5 rounded border border-white/20">
                  {unreadCount} NEW
                </span>
              )}
            </div>
            <button onClick={onClose} className="text-slate-300 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Controls Bar */}
          <div className="px-5 py-3 bg-[#f7f7f6] border-b border-[#d9d9dd] flex items-center justify-between font-mono text-xs">
            <span className="text-slate uppercase tracking-wider text-[10px]">RELEVANT ALERTS</span>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllRead} 
                className="text-[#003c33] hover:underline flex items-center gap-1 font-semibold"
              >
                <CheckCheck size={14} /> MARK ALL READ
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#e5e7eb]">
            {notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`p-4 cursor-pointer transition-colors hover:bg-[#f7f7f6] flex items-start gap-3.5 relative group ${
                  !item.read ? "bg-[#edfce9]/30" : "bg-white"
                }`}
              >
                {!item.read && (
                  <span className="absolute top-4 right-4 h-2 w-2 rounded-full bg-[#003c33]" />
                )}

                <div className="w-9 h-9 rounded-lg bg-[#eeece7] border border-[#d9d9dd] flex items-center justify-center shrink-0 group-hover:bg-[#17171c] group-hover:text-white transition-colors">
                  {getIcon(item.type)}
                </div>

                <div className="flex-1 pr-3">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-display text-xs font-normal text-ink group-hover:text-[#003c33] transition-colors leading-snug">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-slate text-[11px] mt-1 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                  <span className="font-mono text-[10px] text-slate mt-2 block">
                    {item.time} • Tap to view details →
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#e5e7eb] bg-[#f7f7f6] flex items-center justify-between font-mono text-[11px]">
            <span className="text-slate">CAREERSATHI ALERTS</span>
            <Button variant="outline" size="sm" onClick={onClose} className="h-7 text-[11px] font-mono">
              CLOSE DRAWER
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
