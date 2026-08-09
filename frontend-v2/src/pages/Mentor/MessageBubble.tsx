import type { Message } from "../../store/useChatStore";
// Cache bust
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "group flex gap-16 py-24 px-16 md:px-32 w-full",
        isAi ? "bg-background-alt/50" : "bg-white"
      )}
    >
      <div
        className={cn(
          "w-32 h-32 rounded-full flex items-center justify-center shrink-0 mt-4",
          isAi ? "bg-brand-primary text-white" : "bg-black/10 text-text-main"
        )}
      >
        {isAi ? <Brain size={18} /> : <User size={18} />}
      </div>
      
      <div className="flex-1 overflow-hidden min-w-0">
        <div className="prose prose-sm md:prose-base prose-slate max-w-none break-words">
          {message.content ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          ) : (
            <div className="flex items-center gap-4 h-24">
              <span className="w-8 h-8 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-8 h-8 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-8 h-8 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          )}
        </div>

        {isAi && message.content && (
          <div className="flex items-center gap-8 mt-16 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={handleCopy} className="p-6 rounded hover:bg-black/5 text-text-muted transition-colors" title="Copy">
              <Copy size={16} />
            </button>
            <button className="p-6 rounded hover:bg-black/5 text-text-muted transition-colors" title="Regenerate">
              <RefreshCcw size={16} />
            </button>
            <div className="w-px h-16 bg-border mx-4" />
            <button className="p-6 rounded hover:bg-black/5 text-text-muted transition-colors" title="Helpful">
              <ThumbsUp size={16} />
            </button>
            <button className="p-6 rounded hover:bg-black/5 text-text-muted transition-colors" title="Not Helpful">
              <ThumbsDown size={16} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
