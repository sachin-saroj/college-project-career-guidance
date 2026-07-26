import { Types } from 'mongoose';
import { Question } from '../models/Question';
import { AssessmentSession } from '../models/AssessmentSession';
import { AssessmentResult, ITraitScores } from '../models/AssessmentResult';
import { AppError } from '../../../utils/AppError';

export class AssessmentService {
  /**
   * Initializes a new assessment session for a user.
   */
  async startAssessment(userId: string) {
    // Check if user already has an IN_PROGRESS session
    const existing = await AssessmentSession.findOne({ userId, status: 'IN_PROGRESS' });
    if (existing) return existing;

    const session = await AssessmentSession.create({ userId, status: 'IN_PROGRESS', answers: [] });
    return session;
  }

  /**
   * Fetches paginated questions.
   */
  async getQuestions(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const questions = await Question.find({ isActive: true })
      .skip(skip)
      .limit(limit)
      .select('-__v -createdAt -updatedAt'); // Exclude internals
      
    const total = await Question.countDocuments({ isActive: true });
    
    return {
      questions,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Saves a batch of answers to the session.
   */
  async saveAnswers(userId: string, answers: { questionId: string; selectedOptionIndex: number; timeSpentSeconds: number }[]) {
    const session = await AssessmentSession.findOne({ userId, status: 'IN_PROGRESS' });
    if (!session) throw new AppError('No active assessment session found', 404);

    // Merge answers
    answers.forEach(newAnswer => {
      const existingIdx = session.answers.findIndex(a => a.questionId.toString() === newAnswer.questionId);
      if (existingIdx > -1) {
        session.answers[existingIdx] = { ...session.answers[existingIdx], ...newAnswer };
      } else {
        session.answers.push({
          questionId: new Types.ObjectId(newAnswer.questionId),
          selectedOptionIndex: newAnswer.selectedOptionIndex,
          timeSpentSeconds: newAnswer.timeSpentSeconds
        });
      }
    });

    session.lastSavedAt = new Date();
    await session.save();
    return session;
  }

  /**
   * Closes the session and triggers the Scoring Engine.
   */
  async submitAssessment(userId: string) {
    const session = await AssessmentSession.findOne({ userId, status: 'IN_PROGRESS' }).populate('answers.questionId');
    if (!session) throw new AppError('No active assessment session found', 404);

    if (session.answers.length === 0) {
      throw new AppError('Cannot submit empty assessment', 400);
    }

    // 1. Scoring Engine Logic
    const rawScores: Record<keyof ITraitScores, number> = {
      realistic: 0, investigative: 0, artistic: 0, social: 0, 
      enterprising: 0, conventional: 0, analytical: 0, technical: 0, 
      leadership: 0, communication: 0, creativity: 0
    };
    
    // Track max possible scores to normalize later
    const maxScores: Record<keyof ITraitScores, number> = { ...rawScores };

    let totalTime = 0;

    for (const answer of session.answers) {
      const question = answer.questionId as any; // Populated doc
      if (!question) continue;
      
      const option = question.options[answer.selectedOptionIndex];
      if (!option) continue;

      totalTime += answer.timeSpentSeconds;

      // Calculate max possible points for this question across all options
      const maxPossibleForQuestion: Record<string, number> = {};
      question.options.forEach((opt: any) => {
        opt.traitScores.forEach((val: number, trait: string) => {
          if (!maxPossibleForQuestion[trait] || val > maxPossibleForQuestion[trait]) {
            maxPossibleForQuestion[trait] = val;
          }
        });
      });

      // Add actual points achieved
      option.traitScores.forEach((val: number, trait: keyof ITraitScores) => {
        if (rawScores[trait] !== undefined) {
          rawScores[trait] += (val * question.weight);
        }
      });

      // Add max possible points to denominator
      Object.keys(maxPossibleForQuestion).forEach(trait => {
        const key = trait as keyof ITraitScores;
        if (maxScores[key] !== undefined) {
          maxScores[key] += (maxPossibleForQuestion[key] * question.weight);
        }
      });
    }

    // 2. Normalization (0-100 scale)
    const normalizedScores: Partial<ITraitScores> = {};
    (Object.keys(rawScores) as Array<keyof ITraitScores>).forEach(trait => {
      const raw = rawScores[trait];
      const max = maxScores[trait];
      normalizedScores[trait] = max > 0 ? Math.round((raw / max) * 100) : 0;
    });

    // 3. Save Result
    // Upsert to handle edge cases where a previous result exists
    const result = await AssessmentResult.findOneAndUpdate(
      { userId },
      {
        sessionId: session._id,
        scores: normalizedScores,
        completionTimeSeconds: totalTime
      },
      { upsert: true, new: true }
    );

    // 4. Mark session complete
    session.status = 'COMPLETED';
    await session.save();

    return result;
  }
}

export const assessmentService = new AssessmentService();
