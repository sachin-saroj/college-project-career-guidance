import { Profile, IProfile } from '../models/Profile';
import { AppError } from '../../../utils/AppError';
import { UploadService } from './upload.service';

export class ProfileService {
  
  static async getProfileByUserId(userId: string): Promise<any> {
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      throw new AppError('Profile not found', 404);
    }
    
    const completionData = profile.calculateCompletion();
    
    return {
      profile,
      completion: completionData,
    };
  }

  static async updateProfile(userId: string, updateData: Partial<IProfile>): Promise<any> {
    // We use findOne and save instead of findByIdAndUpdate to trigger Mongoose setters/hooks
    const profile = await Profile.findOne({ userId });
    
    if (!profile) {
      throw new AppError('Profile not found', 404);
    }

    // Safely merge nested objects
    if (updateData.personal) Object.assign(profile.personal, updateData.personal);
    if (updateData.academic) Object.assign(profile.academic, updateData.academic);
    if (updateData.career) Object.assign(profile.career, updateData.career);
    if (updateData.socioeconomic) Object.assign(profile.socioeconomic, updateData.socioeconomic);
    if (updateData.preferences) Object.assign(profile.preferences, updateData.preferences);

    await profile.save();

    return this.getProfileByUserId(userId);
  }

  static async uploadAvatar(userId: string, fileBuffer: Buffer): Promise<any> {
    const profile = await Profile.findOne({ userId });
    if (!profile) throw new AppError('Profile not found', 404);

    // Delete old avatar if it exists
    if (profile.personal.avatarUrl) {
      await UploadService.deleteImage(profile.personal.avatarUrl);
    }

    // Upload new image
    const newAvatarUrl = await UploadService.uploadImageBuffer(fileBuffer, `careersathi/avatars/${userId}`);
    
    profile.personal.avatarUrl = newAvatarUrl;
    await profile.save();

    return { avatarUrl: newAvatarUrl };
  }

  static async deleteAvatar(userId: string): Promise<any> {
    const profile = await Profile.findOne({ userId });
    if (!profile) throw new AppError('Profile not found', 404);

    if (profile.personal.avatarUrl) {
      await UploadService.deleteImage(profile.personal.avatarUrl);
      profile.personal.avatarUrl = undefined;
      await profile.save();
    }

    return { message: 'Avatar deleted successfully' };
  }

  static async getDashboardData(userId: string): Promise<any> {
    const profileData = await this.getProfileByUserId(userId);
    
    // Future placeholders for modules that will integrate here
    return {
      profileCompletion: profileData.completion,
      upcomingTasks: [
        { id: 1, title: 'Complete Career Preferences', isCompleted: profileData.completion.score > 80 },
        { id: 2, title: 'Take Career Aptitude Test', isCompleted: false },
      ],
      recommendedCareers: [], // Will be populated by ML Module
      recommendedCourses: [], // Will be populated by Courses Module
      scholarships: [], // Will be populated by Scholarships Module
      recentActivity: [
        { type: 'LOGIN', timestamp: new Date() }
      ]
    };
  }
}
