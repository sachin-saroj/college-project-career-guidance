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
    <div className="w-full md:w-[280px] h-full border-r bg-background-alt flex flex-col hidden md:flex shrink-0">
      <div className="p-16">
        <Button
          onClick={createChat}
          className="w-full justify-start py-24 text-body shadow-sm"
          variant="primary"
        >
          <Plus size={20} className="mr-8" /> New Chat
        </Button>
      </div>

      <div className="px-16 pb-16">
        <div className="relative">
          <Search size={16} className="absolute left-12 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search history..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-36 pr-16 py-8 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-small"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-12 space-y-4">
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => {
              if (editingId !== chat.id) setActiveChat(chat.id);
            }}
            className={cn(
              "group relative flex items-center w-full p-12 rounded-lg cursor-pointer transition-colors",
              activeChatId === chat.id
                ? "bg-brand-primary/10 text-brand-primary font-medium"
                : "hover:bg-black/5 text-text-main"
            )}
          >
            <MessageSquare size={16} className="mr-12 shrink-0 opacity-70" />
            
            {editingId === chat.id ? (
              <input
                autoFocus
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={saveEdit}
                onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                className="flex-1 bg-white border rounded px-8 py-4 text-small focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            ) : (
              <span className="flex-1 truncate text-small">{chat.title}</span>
            )}

            {editingId !== chat.id && (
              <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(chat.id, chat.title);
                  }}
                  className="p-4 rounded-md hover:bg-black/10 text-text-muted"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chat.id);
                  }}
                  className="p-4 rounded-md hover:bg-status-error/10 text-status-error"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        ))}
        {filteredChats.length === 0 && (
          <div className="text-center p-24 text-text-muted text-small">
            No chats found.
          </div>
        )}
      </div>
    </div>
  );
};
