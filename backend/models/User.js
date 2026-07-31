const bcrypt = require('bcrypt');
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
      passwordHash: passwordHash,
      resumeText: userData.resumeText || '',
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
}

module.exports = User;
