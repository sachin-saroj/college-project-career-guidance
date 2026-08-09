import { useEffect, useRef } from "react";
import { useChatStore } from "../../store/useChatStore";
import { ChatInput } from "./ChatInput";
import { MessageBubble } from "./MessageBubble";
import { SuggestedPrompts } from "./SuggestedPrompts";
import { Menu, PanelRightClose, PanelRightOpen } from "lucide-react";

export const ChatArea = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const { chats, activeChatId, isContextPanelOpen, toggleContextPanel } = useChatStore();
  const activeChat = chats.find((c) => c.id === activeChatId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  return (
    <div className="flex-1 flex flex-col h-full relative bg-[#F9FAFB]">
      {/* Header (Mobile menu & Panel toggle) */}
      <div className="absolute top-0 left-0 right-0 h-64 px-16 flex items-center justify-between bg-white/80 backdrop-blur-md border-b z-10">
        <button onClick={onMenuClick} className="p-8 md:hidden text-text-muted hover:bg-black/5 rounded-md">
          <Menu size={20} />
        </button>
        <div className="flex-1 text-center font-medium text-text-main md:text-left md:pl-16 truncate">
          {activeChat?.title || "New Conversation"}
        </div>
        <button 
          onClick={toggleContextPanel} 
          className="p-8 text-text-muted hover:bg-black/5 rounded-md transition-colors hidden lg:block"
          title="Toggle Context Panel"
        >
          {isContextPanelOpen ? <PanelRightClose size={20} /> : <PanelRightOpen size={20} />}
        </button>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto pt-64">
        {(!activeChat || activeChat.messages.length === 0) ? (
          <SuggestedPrompts />
        ) : (
          <div className="pb-32">
            {activeChat.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-gradient-to-t from-[#F9FAFB] to-transparent pt-32 shrink-0">
        <ChatInput />
      </div>
    </div>
  );
};
