import type { ResumeType } from "../schema/resumeSchema";
import api from "../utils/api";

export const resumeService = {
  analyzeResume: async (resumeData: ResumeType) => {
    try {
      const response = await api.post("/resume/analyze", resumeData);
      return response.data;
    } catch (error) {
      console.error("Failed to analyze resume", error);
      throw error;
    }
  },

  rewriteSection: async (sectionType: string, content: string) => {
    try {
      const response = await api.post("/resume/rewrite", { sectionType, content });
      return response.data.result;
    } catch (error) {
      console.error("Failed to rewrite section", error);
      throw error;
    }
  },

  saveResume: async (resumeData: ResumeType) => {
    try {
      const response = await api.put("/resume", resumeData);
      console.log("Saved resume to backend", resumeData.id);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Failed to save resume", error);
      throw error;
    }
  }
};
