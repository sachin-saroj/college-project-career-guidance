import { useEffect, useRef } from "react";
import { useChatStore } from "../../store/useChatStore";
import { ChatInput } from "./ChatInput";
import { MessageBubble } from "./MessageBubble";
import { SuggestedPrompts } from "./SuggestedPrompts";
import { Menu, PanelRightClose, PanelRightOpen, Cpu, UserCheck } from "lucide-react";

interface ChatAreaProps {
  onToggleSidebar: () => void;
  onToggleContext: () => void;
  isContextOpen: boolean;
}

export const ChatArea = ({ onToggleSidebar, onToggleContext, isContextOpen }: ChatAreaProps) => {
  const { chats, activeChatId } = useChatStore();
  const activeChat = chats.find((c) => c.id === activeChatId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  return (
    <div className="flex-1 flex flex-col h-full relative bg-white min-w-0">
      {/* Console Header */}
      <div className="h-14 px-4 sm:px-6 flex items-center justify-between bg-white border-b border-[#e5e7eb] z-10 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 truncate">
          {/* Mobile Sessions Toggle Button */}
          <button 
            onClick={onToggleSidebar} 
            className="p-2 md:hidden text-slate hover:bg-[#eeece7] rounded-lg transition-colors cursor-pointer"
            title="Open Sessions"
          >
            <Menu size={18} />
          </button>

          <div className="flex items-center gap-2 font-mono text-xs text-ink truncate">
            <Cpu size={15} className="text-[#003c33] shrink-0" />
            <span className="truncate font-semibold max-w-[140px] sm:max-w-[260px]">
              {activeChat?.title || "Career Guidance Session"}
            </span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-mono font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>LIVE GEMINI AI MENTOR</span>
          </div>
        </div>

        {/* Right Action: Context Toggle (works on mobile & desktop) */}
        <div className="flex items-center gap-1">
          <button 
            onClick={onToggleContext} 
            className="p-2 text-slate hover:text-ink hover:bg-[#eeece7] rounded-lg transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer"
            title="Toggle Student Profile Context"
          >
            <UserCheck size={16} className="text-[#003c33]" />
            <span className="hidden md:inline text-[11px]">Context</span>
            {isContextOpen ? <PanelRightClose size={16} className="hidden lg:inline" /> : <PanelRightOpen size={16} className="hidden lg:inline" />}
          </button>
        </div>
      </div>

      {/* Message Feed Area */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {(!activeChat || activeChat.messages.length === 0) ? (
          <SuggestedPrompts />
        ) : (
          <div className="pb-6">
            {activeChat.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        )}
      </div>

      {/* Chat Input Container */}
      <div className="bg-white pt-2 shrink-0 border-t border-[#e5e7eb]">
        <ChatInput />
      </div>
    </div>
  );
};
