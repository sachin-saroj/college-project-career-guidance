import { useChatStore } from "../store/useChatStore";
import api from "../utils/api";

const MOCK_API = false; // Set to false to use actual live backend

/**
 * Sends a user message to the Gemini AI backend and renders response with smooth streaming
 */
export const sendMessage = async (chatId: string, prompt: string) => {
  const store = useChatStore.getState();

  // Add the user message immediately
  store.addMessage(chatId, "user", prompt);

  // Create a placeholder AI message with loading indicator
  const aiMessageId = crypto.randomUUID();
  store.addMessage(chatId, "ai", "", aiMessageId);

  try {
    let fullReply = "";

    if (MOCK_API) {
      // Mock response fallback for offline testing
      fullReply = `Here is a breakdown of your query about **"${prompt}"**:\n\n### Recommended Career Trajectory\n1. **Core Fundamentals**: Focus on building a solid foundation through certified free learning resources.\n2. **Hands-On Projects**: Develop real-world portfolio artifacts that demonstrate practical competency.\n3. **Scholarships & Internships**: Regularly apply for verified opportunities matching your background.\n\nFeel free to ask more specific questions about exam syllabi, required tools, or timeline planning!`;
    } else {
      const response = await api.post("/chat", { prompt });
      fullReply = response.data.reply || "No response generated. Please try again.";
    }

    // Fast, natural streaming effect (completes in ~1-1.5s regardless of length)
    const words = fullReply.split(/(?<=\s|-)/);
    const delayPerWord = Math.max(5, Math.min(25, 1200 / (words.length || 1)));
    let currentText = "";

    for (let i = 0; i < words.length; i++) {
      currentText += words[i];
      useChatStore.getState().updateMessage(chatId, aiMessageId, currentText);
      await new Promise((resolve) => setTimeout(resolve, delayPerWord));
    }

  } catch (error: any) {
    console.error("AI Service Error:", error);
    const serverError = error.response?.data?.error;
    const fallbackMsg = serverError
      ? `⚠️ ${serverError}`
      : "⚠️ Sorry, I encountered an issue connecting to the AI Mentor. Please check your connection or try again in a moment.";
    
    useChatStore.getState().updateMessage(chatId, aiMessageId, fallbackMsg);
  }
};
