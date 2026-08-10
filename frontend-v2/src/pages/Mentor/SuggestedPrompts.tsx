import { Lightbulb, Code, Briefcase, GraduationCap, Award } from "lucide-react";
import { sendMessage } from "../../services/aiService";
import { useChatStore } from "../../store/useChatStore";

const prompts = [
  {
    icon: GraduationCap,
    title: "CHARTERED ACCOUNTANT (CA)",
    text: "What is the step-by-step roadmap, exam stages (Foundation, Intermediate, Final), and articleship stipend for CA?",
  },
  {
    icon: Award,
    title: "UPSC CIVIL SERVICES",
    text: "How can a student prepare for UPSC Civil Services IAS/IPS without expensive coaching using free resources?",
  },
  {
    icon: Briefcase,
    title: "SCHOLARSHIPS & FINANCIAL AID",
    text: "List top undergraduate government and private scholarships (Reliance, NSP, HDFC) for underprivileged students.",
  },
  {
    icon: Code,
    title: "TECH & DATA SCIENCE",
    text: "Create a 3-month structured roadmap to build entry-level skills in Web Development or Data Analytics.",
  },
];

export const SuggestedPrompts = () => {
  const { activeChatId, createChat } = useChatStore();

  const handlePromptClick = (prompt: string) => {
    let chatId = activeChatId;
    if (!chatId) {
      chatId = createChat();
    }
    setTimeout(() => {
      sendMessage(chatId, prompt);
    }, 0);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto px-6 py-12 text-white">
      <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-full flex items-center justify-center mb-4 text-coral">
        <Lightbulb size={24} />
      </div>
      <h2 className="font-display text-2xl font-normal text-white mb-2 text-center">
        AI Career Console & Multi-Stream Mentor
      </h2>
      <p className="text-xs text-white/70 mb-8 text-center max-w-md font-sans">
        Get instant personalized guidance for Commerce, Civil Services, Nursing, Trades, and Tech pathways.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        {prompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handlePromptClick(p.text)}
            className="flex flex-col text-left p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/40 hover:bg-white/10 transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-2">
              <p.icon size={16} className="text-coral group-hover:scale-110 transition-transform" />
              <span className="font-mono text-[10px] tracking-wider uppercase text-white/70">{p.title}</span>
            </div>
            <p className="text-xs text-white/90 font-normal leading-relaxed">
              {p.text}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
