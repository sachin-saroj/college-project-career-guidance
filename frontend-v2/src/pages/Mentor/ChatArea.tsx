import { useEffect, useRef } from "react";
import { useChatStore } from "../../store/useChatStore";
import { ChatInput } from "./ChatInput";
import { MessageBubble } from "./MessageBubble";
import { SuggestedPrompts } from "./SuggestedPrompts";
import { Menu, PanelRightClose, PanelRightOpen, Cpu } from "lucide-react";

export const ChatArea = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const { chats, activeChatId, isContextPanelOpen, toggleContextPanel } = useChatStore();
  const activeChat = chats.find((c) => c.id === activeChatId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  return (
    <div className="flex-1 flex flex-col h-full relative bg-white">
      {/* Console Header */}
      <div className="absolute top-0 left-0 right-0 h-14 px-6 flex items-center justify-between bg-white border-b border-[#e5e7eb] z-10">
        <button onClick={onMenuClick} className="p-2 md:hidden text-slate hover:bg-[#eeece7] rounded-md">
          <Menu size={18} />
        </button>

        <div className="flex items-center gap-3 font-mono text-xs text-ink truncate">
          <Cpu size={14} className="text-[#003c33] shrink-0" />
          <span className="truncate">{activeChat?.title || "New AI Session"}</span>
          <span className="hidden sm:inline-block text-[10px] text-slate border-l border-[#d9d9dd] pl-2">
            MODEL: GEMINI 1.5 FLASH
          </span>
        </div>

        <button 
          onClick={toggleContextPanel} 
          className="p-1.5 text-slate hover:text-ink hover:bg-[#eeece7] rounded-md transition-colors hidden lg:block"
          title="Toggle Context Panel"
        >
          {isContextPanelOpen ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
        </button>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto pt-14">
        {(!activeChat || activeChat.messages.length === 0) ? (
          <SuggestedPrompts />
        ) : (
          <div className="pb-8">
            {activeChat.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white pt-2 shrink-0 border-t border-[#e5e7eb]">
        <ChatInput />
      </div>
    </div>
  );
};
