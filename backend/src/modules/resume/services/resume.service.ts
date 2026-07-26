import { Resume, IResume } from '../models/Resume';
import { AppError } from '../../../utils/AppError';

export class ResumeService {
  async createResume(userId: string, data: Partial<IResume>) {
    const resume = await Resume.create({ ...data, userId });
    return resume;
  }

  async getResumesByUser(userId: string) {
    return await Resume.find({ userId }).sort({ updatedAt: -1 });
  }

  async getResumeById(id: string, userId: string) {
    const resume = await Resume.findOne({ _id: id, userId });
    if (!resume) throw new AppError('Resume not found', 404);
    return resume;
  }

  async updateResume(id: string, userId: string, data: Partial<IResume>) {
    const resume = await Resume.findOneAndUpdate(
      { _id: id, userId },
      data,
      { new: true, runValidators: true }
    );
    if (!resume) throw new AppError('Resume not found', 404);
    return resume;
  }

  async deleteResume(id: string, userId: string) {
    const resume = await Resume.findOneAndDelete({ _id: id, userId });
    if (!resume) throw new AppError('Resume not found', 404);
    return true;
  }
}

export const resumeService = new ResumeService();
