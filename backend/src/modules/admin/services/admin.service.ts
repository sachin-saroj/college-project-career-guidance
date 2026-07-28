import { User } from '../../auth/models/User';
import { AuditLog } from '../models/AuditLog';
import { SystemSetting } from '../models/SystemSetting';
import { Course } from '../../resources/models/Course';
import { Scholarship } from '../../resources/models/Scholarship';
import { Internship } from '../../resources/models/Internship';
import { Article } from '../../resources/models/Article';
import { Roadmap } from '../../resources/models/Roadmap';
import { AssessmentSession } from '../../assessment/models/AssessmentSession';

export class AdminService {
  static async getStats() {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'ACTIVE' }); // Assuming status field exists or use something else
    const assessmentsCompleted = await AssessmentSession.countDocuments({ status: 'COMPLETED' });
    
    // Total resources
    const totalCourses = await Course.countDocuments();
    const totalScholarships = await Scholarship.countDocuments();
    const totalInternships = await Internship.countDocuments();
    const totalArticles = await Article.countDocuments();
    const totalRoadmaps = await Roadmap.countDocuments();
    
    return {
      totalUsers,
      activeUsers,
      assessmentsCompleted,
      resourcesViewed: 0, // Placeholder
      systemHealth: 'HEALTHY',
      totalResources: totalCourses + totalScholarships + totalInternships + totalArticles + totalRoadmaps
    };
  }

  static async getUsers(page: number, limit: number, search: string) {
    const skip = (page - 1) * limit;
    const query = search ? { email: { $regex: search, $options: 'i' } } : {};
    
    const users = await User.find(query).skip(skip).limit(limit).select('-passwordHash');
    const total = await User.countDocuments(query);
    
    return {
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  static async getUserById(id: string) {
    return await User.findById(id).select('-passwordHash');
  }

  static async updateUserStatus(id: string, status: string) {
    return await User.findByIdAndUpdate(id, { status }, { new: true });
  }

  static async getResources(page: number, limit: number, search: string) {
    // Basic aggregation across collections or just return from one for now
    // Actually we should return a paginated list of resources.
    // For simplicity, let's just fetch courses as an example, since doing union in mongoose is tricky
    const skip = (page - 1) * limit;
    const query = search ? { title: { $regex: search, $options: 'i' } } : {};
    
    const courses = await Course.find(query).skip(skip).limit(limit);
    const total = await Course.countDocuments(query);
    
    return {
      data: courses.map(c => ({
        ...c.toObject(),
        type: 'COURSE'
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  static async updateResourceStatus(id: string, status: string) {
    // In a real scenario, we'd need to know the type or search all.
    const course = await Course.findByIdAndUpdate(id, { status }, { new: true });
    if (course) return course;
    // fallback for others can be implemented if needed
    return null;
  }

  static async getAnalytics() {
    return { message: 'Analytics data' };
  }

  static async getSystemHealth() {
    return { status: 'HEALTHY' };
  }

  static async getSettings() {
    return await SystemSetting.find();
  }

  static async updateSettings(key: string, value: any, userId: string) {
    return await SystemSetting.findOneAndUpdate(
      { key },
      { value, updatedBy: userId },
      { new: true, upsert: true }
    );
  }

  static async getAuditLogs(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const logs = await AuditLog.find().skip(skip).limit(limit).sort({ createdAt: -1 }).populate('userId', 'email');
    const total = await AuditLog.countDocuments();
    return {
      data: logs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }
}
