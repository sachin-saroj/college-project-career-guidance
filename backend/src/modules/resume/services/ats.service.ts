import { IResume } from '../models/Resume';
import { Career } from '../../career/models/Career';

interface AtsReport {
  score: number;
  missingSections: string[];
  missingSkills: string[];
  suggestions: string[];
}

export class AtsService {
  /**
   * Calculates an ATS score based on section completeness and keyword matching
   * against the target career.
   */
  async calculateScore(resume: IResume): Promise<AtsReport> {
    let score = 100;
    const missingSections: string[] = [];
    const missingSkills: string[] = [];
    const suggestions: string[] = [];

    // 1. Check Completeness
    if (!resume.careerObjective || resume.careerObjective.length < 50) {
      score -= 10;
      missingSections.push('Career Objective');
      suggestions.push('Add a professional summary of at least 50 characters.');
    }

    if (!resume.education || resume.education.length === 0) {
      score -= 20;
      missingSections.push('Education');
      suggestions.push('Add your highest level of education.');
    }

    if (!resume.experience || resume.experience.length === 0) {
      score -= 10;
      missingSections.push('Experience');
      suggestions.push('Add any relevant experience, internships, or volunteer work.');
    }

    if (!resume.projects || resume.projects.length === 0) {
      score -= 10;
      missingSections.push('Projects');
      suggestions.push('Add at least one project to demonstrate practical application of skills.');
    }

    if (!resume.skills || resume.skills.length < 3) {
      score -= 10;
      missingSections.push('Skills');
      suggestions.push('List at least 3 hard skills.');
    }

    // 2. Keyword Matching (If target career is provided)
    if (resume.targetCareerId) {
      const targetCareer = await Career.findById(resume.targetCareerId);
      if (targetCareer) {
        const requiredSkills = targetCareer.requiredSkills.map(s => s.toLowerCase());
        const resumeSkills = resume.skills.map(s => s.toLowerCase());

        requiredSkills.forEach(reqSkill => {
          if (!resumeSkills.includes(reqSkill)) {
            missingSkills.push(reqSkill);
            score -= 2; // Penalize for missing key skills
          }
        });

        if (missingSkills.length > 0) {
          suggestions.push(`Consider adding these missing skills: ${missingSkills.slice(0, 5).join(', ')}`);
        }
      }
    }

    // Ensure score doesn't drop below 0
    score = Math.max(0, score);

    return {
      score,
      missingSections,
      missingSkills,
      suggestions
    };
  }
}

export const atsService = new AtsService();
