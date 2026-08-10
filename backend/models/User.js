const bcrypt = require('bcryptjs');
const { readDB, writeDB } = require('../db');

class User {
  static async findOne(query) {
    const db = readDB();
    return db.users.find(u => {
      let match = true;
      for (let key in query) {
        if (u[key] !== query[key]) match = false;
      }
      return match;
    });
  }

  static async findById(id) {
    const db = readDB();
    return db.users.find(u => u._id === id);
  }

  static async create(userData) {
    const db = readDB();
    
    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(userData.passwordHash, salt);
    
    const newUser = {
      _id: Date.now().toString(), // Simple unique ID
      name: userData.name,
      email: userData.email,
      role: userData.email === 'admin@careersathi.com' ? 'admin' : 'user',
      passwordHash: passwordHash,
      resumeText: userData.resumeText || '',
      resumeData: null,
      education: '',
      skills: '',
      interests: '',
      careerGoal: '',
      familyIncome: '',
      assessmentCompleted: false,
      lastRecommendations: null,
      bookmarkedResources: [],
      createdAt: new Date().toISOString()
    };
    
    db.users.push(newUser);
    writeDB(db);
    return newUser;
  }

  static async update(id, updateData) {
    const db = readDB();
    const index = db.users.findIndex(u => u._id === id);
    if (index !== -1) {
      db.users[index] = { ...db.users[index], ...updateData };
      writeDB(db);
      return db.users[index];
    }
    return null;
  }

  static async comparePassword(candidatePassword, userPasswordHash) {
    return await bcrypt.compare(candidatePassword, userPasswordHash);
  }

  static async addBookmark(userId, resourceId) {
    const db = readDB();
    const userIndex = db.users.findIndex(u => u._id === userId);
    if (userIndex !== -1) {
      if (!db.users[userIndex].bookmarkedResources) {
        db.users[userIndex].bookmarkedResources = [];
      }
      if (!db.users[userIndex].bookmarkedResources.includes(resourceId)) {
        db.users[userIndex].bookmarkedResources.push(resourceId);
        writeDB(db);
      }
      return db.users[userIndex].bookmarkedResources;
    }
    return null;
  }

  static async removeBookmark(userId, resourceId) {
    const db = readDB();
    const userIndex = db.users.findIndex(u => u._id === userId);
    if (userIndex !== -1) {
      if (!db.users[userIndex].bookmarkedResources) {
        db.users[userIndex].bookmarkedResources = [];
      }
      db.users[userIndex].bookmarkedResources = db.users[userIndex].bookmarkedResources.filter(id => id !== resourceId);
      writeDB(db);
      return db.users[userIndex].bookmarkedResources;
    }
    return null;
  }

  static delete(id) {
    const db = readDB();
    const index = db.users.findIndex(u => u._id === id);
    if (index !== -1) {
      db.users.splice(index, 1);
      writeDB(db);
      return true;
    }
    return false;
  }

  static getProfileCompletion(user) {
    if (!user) return 0;
    let score = 0;
    if (user.name && user.name.trim()) score += 20;
    if (user.education && user.education.trim()) score += 16;
    if (user.skills && user.skills.trim()) score += 16;
    if ((user.interests && user.interests.trim()) || (user.careerGoal && user.careerGoal.trim())) score += 16;
    if (user.assessmentCompleted) score += 16;
    if (user.resumeData || (user.resumeText && user.resumeText.trim())) score += 16;
    return score;
  }
}

module.exports = User;
