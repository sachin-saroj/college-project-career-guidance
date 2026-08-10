import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, X } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { sendMessage } from "../../services/aiService";

export const ChatInput = () => {
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { activeChatId, createChat } = useChatStore();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleSubmit = async () => {
    if ((!input.trim() && !file) || !activeChatId) {
      if (input.trim() || file) {
        const newChatId = createChat();
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
    <div className="relative max-w-4xl mx-auto w-full px-4 pb-4">
      {file && (
        <div className="absolute -top-10 left-4 flex items-center bg-[#17171c] border border-white/20 rounded-md px-3 py-1.5 gap-2 text-white font-mono text-xs">
          <Paperclip size={12} className="text-coral" />
          <span className="truncate max-w-[200px]">
            {file.name}
          </span>
          <button
            onClick={() => setFile(null)}
            className="p-1 hover:bg-white/10 rounded-full text-white/70"
          >
            <X size={12} />
          </button>
        </div>
      )}

      <div className="flex items-end gap-2 bg-white/5 border border-white/15 rounded-lg p-2.5 focus-within:border-white/40 transition-all">
        <label className="p-2 hover:bg-white/10 rounded-md cursor-pointer text-white/60 hover:text-white shrink-0 transition-colors">
          <Paperclip size={18} />
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
          placeholder="Ask AI Mentor for guidance, roadmaps, resume feedback..."
          className="flex-1 max-h-[180px] min-h-[38px] py-2 bg-transparent resize-none focus:outline-none text-sm text-white placeholder:text-white/40 font-sans"
          rows={1}
        />

        <button
          onClick={handleSubmit}
          disabled={!input.trim() && !file}
          className="p-2.5 rounded-full bg-white text-[#17171c] hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed shrink-0 transition-colors font-medium"
        >
          <Send size={16} />
        </button>
      </div>
      <div className="text-center mt-2">
        <span className="font-mono text-[10px] text-white/30 uppercase tracking-wider">
          GEMINI 1.5 PRO INFRASTRUCTURE • VERIFY CRITICAL ADVICE
        </span>
      </div>
    </div>
  );
};

