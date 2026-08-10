import { useChatStore } from "../../store/useChatStore";
import { Button } from "../../components/ui/Button";
import { Plus, MessageSquare, Search, Trash2, Edit2 } from "lucide-react";
import { useState } from "react";
import { cn } from "../../utils/cn";

export const ChatSidebar = () => {
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

  return (
    <div className="w-full md:w-[260px] h-full border-r border-[#d9d9dd] bg-[#f7f7f6] text-ink flex flex-col hidden md:flex shrink-0">
      <div className="p-4 border-b border-[#d9d9dd]">
        <Button
          onClick={createChat}
          className="w-full justify-center py-2 text-xs font-mono"
          variant="primary"
        >
          <Plus size={14} className="mr-1.5" /> NEW CONVERSATION
        </Button>
      </div>

      <div className="px-4 py-3 border-b border-[#d9d9dd]">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
          <input
            type="text"
            placeholder="Search sessions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-md border border-[#d9d9dd] bg-white focus:outline-none focus:border-[#17171c] font-mono text-xs text-ink placeholder:text-slate"
          />
        </div>
      </div>

      <div className="px-4 pt-3 pb-1">
        <span className="font-mono text-[10px] uppercase tracking-widest text-slate">PAST SESSIONS</span>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => {
              if (editingId !== chat.id) setActiveChat(chat.id);
            }}
            className={cn(
              "group relative flex items-center w-full px-3 py-2 rounded-md cursor-pointer transition-colors text-xs font-mono",
              activeChatId === chat.id
                ? "bg-[#eeece7] text-ink font-medium border border-[#d9d9dd]"
                : "hover:bg-[#eeece7]/60 text-slate hover:text-ink"
            )}
          >
            <MessageSquare size={14} className="mr-2.5 shrink-0 opacity-60 text-[#003c33]" />
            
            {editingId === chat.id ? (
              <input
                autoFocus
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={saveEdit}
                onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                className="flex-1 bg-white border border-[#d9d9dd] rounded px-2 py-1 text-xs text-ink focus:outline-none"
              />
            ) : (
              <span className="flex-1 truncate">{chat.title}</span>
            )}

            {editingId !== chat.id && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(chat.id, chat.title);
                  }}
                  className="p-1 rounded hover:bg-black/5 text-slate"
                >
                  <Edit2 size={12} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chat.id);
                  }}
                  className="p-1 rounded hover:bg-red-500/10 text-red-600"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            )}
          </div>
        ))}
        {filteredChats.length === 0 && (
          <div className="text-center p-4 font-mono text-xs text-slate">
            No active sessions.
          </div>
        )}
      </div>
    </div>
  );
};
