import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, X } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { sendMessage } from "../../services/aiService";

export const ChatInput = () => {
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { activeChatId, createChat } = useChatStore();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = async () => {
    if ((!input.trim() && !file) || !activeChatId) {
      // If no active chat, create one first, then send
      if (input.trim() || file) {
        const newChatId = createChat();
        // Allow state to settle before sending (simple timeout or just call service directly)
        setTimeout(() => handleSendToChat(newChatId), 0);
      }
      return;
    }
    handleSendToChat(activeChatId);
  };

  const handleSendToChat = (chatId: string) => {
    let prompt = input.trim();
    if (file) {
      prompt = `[Attached File: ${file.name}] ${prompt}`;
    }
    
    setInput("");
    setFile(null);
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    sendMessage(chatId, prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto w-full px-16 pb-24">
      {file && (
        <div className="absolute -top-40 left-16 flex items-center bg-white border shadow-sm rounded-lg px-12 py-8 gap-8">
          <Paperclip size={14} className="text-brand-primary" />
          <span className="text-small text-text-main truncate max-w-[200px]">
            {file.name}
          </span>
          <button
            onClick={() => setFile(null)}
            className="p-2 hover:bg-black/5 rounded-full text-text-muted"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div className="flex items-end gap-8 bg-white border shadow-sm rounded-2xl p-8 focus-within:ring-2 focus-within:ring-brand-primary/20 transition-all">
        <label className="p-12 hover:bg-black/5 rounded-xl cursor-pointer text-text-muted shrink-0 transition-colors">
          <Paperclip size={20} />
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.txt,image/*"
          />
        </label>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask CareerSathi anything..."
          className="flex-1 max-h-[200px] min-h-[44px] py-12 bg-transparent resize-none focus:outline-none text-body text-text-main placeholder:text-text-muted/60"
          rows={1}
        />

        <button
          onClick={handleSubmit}
          disabled={!input.trim() && !file}
          className="p-12 rounded-xl bg-brand-primary text-white hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 transition-colors"
        >
          <Send size={20} className={input.trim() || file ? "translate-x-1" : ""} />
        </button>
      </div>
      <div className="text-center mt-8">
        <span className="text-[11px] text-text-muted">
          CareerSathi AI can make mistakes. Consider verifying important information.
        </span>
      </div>
    </div>
  );
};
