import { useChatStore } from "../../store/useChatStore";
import { Button } from "../../components/ui/Button";
import { Plus, MessageSquare, Search, Trash2, Edit2, X, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "../../utils/cn";

interface ChatSidebarProps {
  isMobileDrawer?: boolean;
  onCloseMobile?: () => void;
}

export const ChatSidebar = ({ isMobileDrawer, onCloseMobile }: ChatSidebarProps) => {
  const { chats, activeChatId, createChat, setActiveChat, deleteChat, updateChatTitle } = useChatStore();
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const filteredChats = chats.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (id: string, title: string) => {
    setEditingId(id);
    setEditTitle(title);
  };

  const saveEdit = () => {
    if (editingId && editTitle.trim()) {
      updateChatTitle(editingId, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleNewConversation = () => {
    createChat();
    if (onCloseMobile) onCloseMobile();
  };

  const handleSelectChat = (id: string) => {
    setActiveChat(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <div className={cn(
      "h-full border-r border-[#d9d9dd] bg-[#f7f7f6] text-ink flex flex-col shrink-0",
      isMobileDrawer ? "w-full" : "w-full md:w-[260px] hidden md:flex"
    )}>
      {/* Sidebar Header */}
      <div className="p-4 border-b border-[#d9d9dd] flex items-center justify-between gap-2">
        <Button
          onClick={handleNewConversation}
          className="flex-1 justify-center py-2 text-xs font-mono bg-[#003c33] text-white hover:bg-[#002b24] shadow-xs cursor-pointer"
          variant="primary"
        >
          <Plus size={14} className="mr-1.5" /> NEW SESSION
        </Button>

        {isMobileDrawer && (
          <button
            onClick={onCloseMobile}
            className="p-2 rounded-lg hover:bg-[#eeece7] text-slate hover:text-ink transition-colors cursor-pointer"
            title="Close Drawer"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="px-4 py-3 border-b border-[#d9d9dd]">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
          <input
            type="text"
            placeholder="Search sessions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#d9d9dd] bg-white focus:outline-none focus:border-[#003c33] font-mono text-xs text-ink placeholder:text-slate"
          />
        </div>
      </div>

      {/* Session List Title */}
      <div className="px-4 pt-3 pb-1 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-slate">PAST SESSIONS</span>
        <span className="font-mono text-[10px] text-slate">{chats.length} total</span>
      </div>

      {/* Session Items */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1 py-1">
        {filteredChats.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-xs text-slate font-mono">No sessions found</p>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleSelectChat(chat.id)}
              className={cn(
                "group relative flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-sans cursor-pointer transition-all",
                activeChatId === chat.id
                  ? "bg-white text-ink border border-[#d9d9dd] shadow-xs font-medium"
                  : "text-slate hover:bg-[#eeece7] hover:text-ink"
              )}
            >
              <div className="flex items-center gap-2 truncate flex-1 mr-2">
                <MessageSquare size={13} className={activeChatId === chat.id ? "text-[#003c33] shrink-0" : "shrink-0 opacity-60"} />
                {editingId === chat.id ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={saveEdit}
                    onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                    className="w-full bg-transparent border-b border-[#003c33] outline-none font-mono text-xs"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span className="truncate">{chat.title}</span>
                )}
              </div>

              {/* Action buttons on hover */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(chat.id, chat.title);
                  }}
                  className="p-1 hover:text-ink text-slate"
                  title="Rename"
                >
                  <Edit2 size={11} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chat.id);
                  }}
                  className="p-1 hover:text-red-500 text-slate"
                  title="Delete"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-[#d9d9dd] bg-white/50 text-[11px] font-mono text-slate flex items-center gap-2">
        <Sparkles size={12} className="text-[#003c33]" />
        <span>Context-Aware Memory Active</span>
      </div>
    </div>
  );
};
