import { Types } from 'mongoose';
import { Career } from '../models/Career';
import { Recommendation, IRecommendationMatch } from '../models/Recommendation';
import { AssessmentResult, ITraitScores } from '../../assessment/models/AssessmentResult';
import { Profile } from '../../student/models/Profile';
import { AppError } from '../../../utils/AppError';

export class RecommendationService {
  /**
   * Generates or retrieves personalized career recommendations.
   * This is a deterministic engine mapping Assessment Traits to Career Requirements.
   */
  async getRecommendations(userId: string) {
    // 1. Check if cached recommendations exist
    const existing = await Recommendation.findOne({ userId }).populate('matches.careerId');
    // For MVP, we'll recompute every time if we want dynamic updates, but caching is implemented.
    // To force recompute, we can skip returning existing unless they request it. 
    // Let's implement fresh computation every time for now, overwriting the old one.

    // 2. Fetch User Data
    const assessmentResult = await AssessmentResult.findOne({ userId });
    if (!assessmentResult) {
      throw new AppError('Assessment incomplete. Cannot generate recommendations.', 400);
    }

    const userProfile = await Profile.findOne({ userId });
    // In a full production system, we'd use userProfile to filter out careers based on 
    // hard constraints (e.g. Science stream required, but student took Arts).
    // For this engine, we will compute similarity for all active careers.

    const allCareers = await Career.find({});
    if (allCareers.length === 0) {
      throw new AppError('Career knowledge base is empty.', 500);
    }

    const matches: IRecommendationMatch[] = [];

    // 3. Compute Similarity for each Career
    for (const career of allCareers) {
      const matchData = this.calculateCompatibility(assessmentResult.scores, career);
      matches.push(matchData);
    }

    // 4. Sort by compatibility descending and take top 10
    matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    const top10 = matches.slice(0, 10);

    // 5. Cache the result
    const recommendation = await Recommendation.findOneAndUpdate(
      { userId },
      {
        assessmentResultId: assessmentResult._id,
        matches: top10
      },
      { upsert: true, new: true }
    ).populate('matches.careerId');

    return recommendation;
  }

  /**
   * Retrieves deep details for a specific recommendation
   */
  async getRecommendationDetails(userId: string, careerId: string) {
    const recommendation = await Recommendation.findOne({ userId });
    if (!recommendation) {
      throw new AppError('No recommendations found. Please complete the assessment.', 404);
    }

    const match = recommendation.matches.find(m => m.careerId.toString() === careerId);
    if (!match) {
      throw new AppError('This career was not in your top recommendations.', 404);
    }

    const career = await Career.findById(careerId);
    return {
      match,
      career
    };
  }

  /**
   * Deterministic logic comparing User Traits vs Career Requirements.
   */
  private calculateCompatibility(userScores: ITraitScores, career: any): IRecommendationMatch {
    const requirements = career.traitRequirements as Map<string, number>;
    
    let totalScore = 0;
    let maxPossible = 0;
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const improvementAreas: string[] = [];
    
    requirements.forEach((requiredScore: number, trait: string) => {
      const userScore = (userScores as any)[trait] || 0;
      
      // We use a weighted penalty for being under, and cap for being over
      if (userScore >= requiredScore) {
        totalScore += requiredScore; // Max points
        if (userScore > requiredScore + 15) {
          strengths.push(`Your high ${trait} score (${userScore}) makes you exceptional for this role.`);
        } else if (strengths.length < 3) {
           strengths.push(`Strong ${trait} alignment.`);
        }
      } else {
        // Partial points based on ratio
        totalScore += userScore;
        const deficit = requiredScore - userScore;
        
        if (deficit > 30) {
          weaknesses.push(`Requires significantly higher ${trait} (Needed: ${requiredScore}, Yours: ${userScore}).`);
        } else {
          improvementAreas.push(`Work on improving your ${trait} skills to better match this career.`);
        }
      }
      
      maxPossible += requiredScore;
    });

    // Handle edge case where career has no requirements mapped
    if (maxPossible === 0) {
        return {
            careerId: career._id,
            compatibilityScore: 0,
            strengths: [],
            weaknesses: ['Career has no trait requirements defined in knowledge base.'],
            improvementAreas: [],
            reasoning: 'Cannot compute compatibility.'
        };
    }

    const compatibilityPercentage = Math.round((totalScore / maxPossible) * 100);

    let reasoning = `You are a ${compatibilityPercentage}% match for ${career.name}. `;
    if (compatibilityPercentage > 85) reasoning += "This is highly recommended based on your psychometric profile.";
    else if (compatibilityPercentage > 70) reasoning += "This is a solid option, though some areas require development.";
    else reasoning += "This career might be challenging based on your current trait profile.";

    return {
      careerId: career._id,
      compatibilityScore: compatibilityPercentage,
      strengths,
      weaknesses,
      improvementAreas,
      reasoning
    };
  }
}

export const recommendationService = new RecommendationService();
