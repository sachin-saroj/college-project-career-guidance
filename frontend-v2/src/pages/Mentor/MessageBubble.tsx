import type { Message } from "../../store/useChatStore";
import { Brain, User, Copy, RefreshCcw, ThumbsUp, ThumbsDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "../../utils/cn";
import { motion } from "framer-motion";

export const MessageBubble = ({ message }: { message: Message }) => {
  const isAi = message.role === "ai";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "group flex gap-4 py-4 px-6 md:px-8 w-full border-b border-white/5 text-white",
        isAi ? "bg-[#17171c]" : "bg-white/5"
      )}
    >
      <div
        className={cn(
          "w-7 h-7 rounded flex items-center justify-center shrink-0 mt-1 border text-xs font-mono",
          isAi ? "bg-[#003c33] text-white border border-[#003c33]" : "bg-white/10 text-white border-white/20"
        )}
      >
        {isAi ? <Brain size={14} /> : <User size={14} />}
      </div>
      
      <div className="flex-1 overflow-hidden min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-[11px] uppercase tracking-wider text-white/50">
            {isAi ? "CAREERSATHI AI MENTOR" : "STUDENT"}
          </span>
          <span className="font-mono text-[10px] text-white/30">• {new Date((message as any).timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>

        <div className="prose prose-invert prose-sm max-w-none text-white/90 leading-relaxed font-sans">
          {message.content ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          ) : (
            <div className="flex items-center gap-1.5 h-6 font-mono text-xs text-white/50">
              <span className="w-1.5 h-1.5 bg-coral rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 bg-coral rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 bg-coral rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          )}
        </div>

        {isAi && message.content && (
          <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={handleCopy} className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors" title="Copy">
              <Copy size={13} />
            </button>
            <button className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors" title="Regenerate">
              <RefreshCcw size={13} />
            </button>
            <div className="w-px h-3 bg-white/20 mx-1" />
            <button className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors" title="Helpful">
              <ThumbsUp size={13} />
            </button>
            <button className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors" title="Not Helpful">
              <ThumbsDown size={13} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

