import { Lightbulb, Code, BookOpen, Briefcase } from "lucide-react";
import { sendMessage } from "../../services/aiService";
import { useChatStore } from "../../store/useChatStore";

const prompts = [
  {
    icon: Lightbulb,
    title: "Career Exploration",
    text: "What careers fit someone who loves math and art?",
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    icon: Code,
    title: "Skill Building",
    text: "Create a 3-month roadmap to learn Python for Data Science.",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: Briefcase,
    title: "Resume & Interviews",
    text: "How should I structure my resume with no work experience?",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
  {
    icon: BookOpen,
    title: "Scholarships",
    text: "Find scholarships for engineering students in India.",
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
];

export const SuggestedPrompts = () => {
  const { activeChatId, createChat } = useChatStore();

  const handlePromptClick = (prompt: string) => {
    let chatId = activeChatId;
    if (!chatId) {
      chatId = createChat();
    }
    // Timeout to allow state to settle
    setTimeout(() => {
      sendMessage(chatId, prompt);
    }, 0);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto px-16 py-32">
      <div className="w-64 h-64 bg-brand-light text-brand-primary rounded-full flex items-center justify-center mb-24">
        <Lightbulb size={32} />
      </div>
      <h2 className="text-h3 font-bold text-text-main mb-8 text-center">
        How can I help you today?
      </h2>
      <p className="text-body text-text-muted mb-40 text-center">
        I'm your personal AI Career Mentor. Ask me anything.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 w-full">
        {prompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handlePromptClick(p.text)}
            className="flex flex-col text-left p-24 bg-white border shadow-sm rounded-xl hover:border-brand-primary/50 hover:shadow-md transition-all group"
          >
            <div className={`w-32 h-32 rounded-lg ${p.bg} ${p.color} flex items-center justify-center mb-16 group-hover:scale-110 transition-transform`}>
              <p.icon size={16} />
            </div>
            <h3 className="text-small font-semibold text-text-main mb-4">{p.title}</h3>
            <p className="text-small text-text-muted line-clamp-2">{p.text}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
