import { useChatStore } from "../store/useChatStore";
import api from "../utils/api";

const MOCK_API = false; // Set to false to use actual backend

/**
 * Simulates a streaming response by updating the store chunk by chunk
 */
export const sendMessage = async (chatId: string, prompt: string) => {
  const store = useChatStore.getState();
  const token = localStorage.getItem("token"); // Assuming auth token

  // Add the user message immediately
  store.addMessage(chatId, "user", prompt);

  // Create a placeholder AI message
  const aiMessageId = crypto.randomUUID();
  store.addMessage(chatId, "ai", "", aiMessageId);

  try {
    let fullReply = "";

    if (MOCK_API || !token) {
      // Mock response for development if backend isn't ready
      fullReply = `Here is a breakdown of your query about **"${prompt}"**:\n\n### Recommended Paths\n- **Option 1**: Software Engineering\n- **Option 2**: Data Science\n\n1. First step is to build a portfolio.\n2. Apply for internships.\n\nLet me know if you want to dive deeper into any of these!`;
    } else {
      const response = await api.post("/chat", { prompt });
      fullReply = response.data.reply || "No response generated.";
    }

    // Streaming Simulator Effect
    const words = fullReply.split(/(?<=\s|-)/); // Split by words keeping delimiters
    let currentText = "";

    for (let i = 0; i < words.length; i++) {
      currentText += words[i];
      // Update the message in the store
      useChatStore.getState().updateMessage(chatId, aiMessageId, currentText);
      // Wait for 10-30ms to simulate typing speed
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 20 + 10));
    }

  } catch (error) {
    console.error("AI Service Error:", error);
    useChatStore.getState().updateMessage(
      chatId,
      aiMessageId,
      "⚠️ Sorry, I encountered an error while processing your request. Please try again later."
    );
  }
};
