import { GeminiProvider } from '../../ai/providers/GeminiProvider';
import { AppError } from '../../../utils/AppError';
import { IResume } from '../models/Resume';

// Re-using the Gemini Provider established in Phase 7 for modularity
const aiProvider = new GeminiProvider();

export class AIResumeAssistantService {
  /**
   * Rewrites an array of raw bullet points using the STAR method (Situation, Task, Action, Result)
   * Enforces strict guardrails against fabricating data.
   */
  async rewriteBulletPoints(rawBullets: string[]): Promise<string[]> {
    if (!rawBullets || rawBullets.length === 0) return [];

    const systemPrompt = `
      You are an expert Resume Writer and ATS Optimizer.
      Your task is to rewrite the provided experience bullet points to be highly professional and impactful.
      
      RULES:
      1. DO NOT invent, fabricate, or add any skills, metrics, or experiences that are not explicitly stated in the input.
      2. Use strong action verbs (e.g., Developed, Orchestrated, Spearheaded).
      3. Aim for the STAR method (Situation, Task, Action, Result) if the context allows.
      4. Keep them concise.
      
      Return ONLY a JSON array of strings containing the rewritten bullets.
    `;

    const userPrompt = `Raw bullets:\n${rawBullets.map(b => `- ${b}`).join('\n')}`;

    try {
      const response = await aiProvider.generateText(systemPrompt, userPrompt);
      // We expect the AI to return a JSON array string.
      const parsed = JSON.parse(response);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      throw new Error('Invalid format returned by AI');
    } catch (error) {
      console.error('AI Rewrite Error:', error);
      throw new AppError('Failed to generate AI rewrite. Please try again later.', 500);
    }
  }

  /**
   * Generates a professional Career Objective / Summary based on the resume data.
   */
  async generateSummary(resume: Partial<IResume>): Promise<string> {
    const systemPrompt = `
      You are an expert Resume Writer.
      Write a compelling 3-4 sentence Career Objective / Professional Summary based ONLY on the provided JSON data.
      Highlight the candidate's top skills, highest education, and strongest project/experience.
      DO NOT invent any details.
      Return ONLY the summary text, nothing else.
    `;

    const userPrompt = JSON.stringify({
      education: resume.education,
      experience: resume.experience,
      skills: resume.skills,
      projects: resume.projects
    }, null, 2);

    try {
      const response = await aiProvider.generateText(systemPrompt, userPrompt);
      return response.trim();
    } catch (error) {
      console.error('AI Summary Error:', error);
      throw new AppError('Failed to generate AI summary.', 500);
    }
  }
}

export const aiResumeAssistantService = new AIResumeAssistantService();
