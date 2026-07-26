import { Portfolio, IPortfolio } from '../models/Portfolio';
import mongoose from 'mongoose';

export class PortfolioService {
  static async getPortfolioByUserId(userId: string): Promise<IPortfolio | null> {
    return await Portfolio.findOne({ userId });
  }

  static async createPortfolio(userId: string, data: Partial<IPortfolio>): Promise<IPortfolio> {
    const existing = await Portfolio.findOne({ userId });
    if (existing) {
      throw new Error('Portfolio already exists for this user');
    }
    const portfolio = new Portfolio({ ...data, userId });
    return await portfolio.save();
  }

  static async updatePortfolio(userId: string, data: Partial<IPortfolio>): Promise<IPortfolio | null> {
    return await Portfolio.findOneAndUpdate(
      { userId },
      { $set: data },
      { new: true, runValidators: true }
    );
  }

  static async deletePortfolio(userId: string): Promise<boolean> {
    const result = await Portfolio.deleteOne({ userId });
    return result.deletedCount > 0;
  }
}
