import { Course } from '../models/Course';
import { Scholarship } from '../models/Scholarship';
import { Internship } from '../models/Internship';
import { Roadmap } from '../models/Roadmap';
import { Article } from '../models/Article';
import { Recommendation } from '../../career/models/Recommendation';
import { Profile } from '../../student/models/Profile';
import { Bookmark } from '../models/Bookmark';
import { AppError } from '../../../utils/AppError';

export class ResourceService {
  
  /**
   * Global text search across a specific resource type.
   */
  async searchResources(query: string, type: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    let model: any;

    switch (type.toLowerCase()) {
      case 'course': model = Course; break;
      case 'scholarship': model = Scholarship; break;
      case 'internship': model = Internship; break;
      case 'article': model = Article; break;
      default: throw new AppError('Invalid resource type', 400);
    }

    const searchQuery = query ? { $text: { $search: query } } : {};
    
    // Sort by text score if searching, else fallback to newest
    const sortParams = query ? { score: { $meta: 'textScore' } } : { createdAt: -1 };

    const results = await model.find(searchQuery)
      .sort(sortParams)
      .skip(skip)
      .limit(limit);
      
    const total = await model.countDocuments(searchQuery);

    return {
      results,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Automatically gathers all recommended resources for a student
   * based on their Phase 6 Assessment output and Phase 5 Profile.
   */
  async getRecommendedResources(userId: string) {
    
    // 1. Fetch User Data
    const profile = await Profile.findOne({ userId });
    const recommendation = await Recommendation.findOne({ userId });
    
    if (!recommendation || recommendation.matches.length === 0) {
      throw new AppError('Complete the career assessment to unlock personalized resources.', 400);
    }

    // 2. Extract Top 3 Career IDs to map against
    const topCareerIds = recommendation.matches.slice(0, 3).map(m => m.careerId);

    // 3. Fetch Career-Mapped Resources
    const [courses, internships, roadmaps, articles] = await Promise.all([
      Course.find({ mappedCareers: { $in: topCareerIds } }).limit(5),
      Internship.find({ mappedCareers: { $in: topCareerIds }, status: 'Open' }).limit(5),
      Roadmap.find({ careerId: { $in: topCareerIds } }),
      Article.find({ mappedCareers: { $in: topCareerIds }, status: 'Published' }).limit(3)
    ]);

    // 4. Determine Scholarship Eligibility
    let scholarships = [];
    if (profile) {
      // Very basic MVP matching: check if family income is below the scholarship's max threshold
      const userIncome = profile.socioeconomic?.familyIncome || 0;
      scholarships = await Scholarship.find({
        'eligibilityCriteria.maxFamilyIncome': { $gte: userIncome },
        status: 'Open'
      }).limit(5);
    } else {
      // Fallback: just show some open ones
      scholarships = await Scholarship.find({ status: 'Open' }).limit(3);
    }

    return {
      topCareers: topCareerIds, // IDs of the careers these resources belong to
      resources: {
        courses,
        internships,
        roadmaps,
        articles,
        scholarships
      }
    };
  }

  /**
   * Retrieves all bookmarks for a specific user
   */
  async getBookmarks(userId: string) {
    const bookmarks = await Bookmark.find({ userId }).select('resourceId resourceType');
    return bookmarks;
  }

  /**
   * Add a bookmark
   */
  async addBookmark(userId: string, resourceId: string, resourceType: string) {
    const validTypes = ['COURSE', 'SCHOLARSHIP', 'INTERNSHIP', 'ARTICLE', 'ROADMAP'];
    if (!validTypes.includes(resourceType)) {
      throw new AppError('Invalid resource type for bookmark', 400);
    }
    
    // Check if exists
    const existing = await Bookmark.findOne({ userId, resourceId });
    if (existing) {
      return existing; // Idempotent
    }

    const bookmark = new Bookmark({ userId, resourceId, resourceType });
    return await bookmark.save();
  }

  /**
   * Remove a bookmark
   */
  async removeBookmark(userId: string, resourceId: string) {
    const result = await Bookmark.deleteOne({ userId, resourceId });
    if (result.deletedCount === 0) {
      throw new AppError('Bookmark not found', 404);
    }
    return true;
  }
}

export const resourceService = new ResourceService();
