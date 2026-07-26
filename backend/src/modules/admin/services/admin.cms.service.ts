import { Course } from '../../resources/models/Course';
import { Scholarship } from '../../resources/models/Scholarship';
import { Internship } from '../../resources/models/Internship';
import { Article } from '../../resources/models/Article';
import { Roadmap } from '../../resources/models/Roadmap';

export class AdminCMSService {
  private static getModel(type: string) {
    switch (type.toLowerCase()) {
      case 'courses': return Course;
      case 'scholarships': return Scholarship;
      case 'internships': return Internship;
      case 'articles': return Article;
      case 'roadmaps': return Roadmap;
      default: throw new Error('Invalid resource type');
    }
  }

  static async createResource(type: string, data: any) {
    const Model = this.getModel(type);
    const doc = new Model(data);
    return await doc.save();
  }

  static async updateResource(type: string, id: string, data: any) {
    const Model = this.getModel(type);
    return await Model.findByIdAndUpdate(id, data, { new: true });
  }

  static async deleteResource(type: string, id: string) {
    const Model = this.getModel(type);
    return await Model.findByIdAndDelete(id);
  }
}
