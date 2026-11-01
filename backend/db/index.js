import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import * as schema from './schema.js';
import { logger } from '../logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = process.env.SQLITE_DB_PATH
  ? path.resolve(process.env.SQLITE_DB_PATH)
  : path.join(__dirname, '../database.sqlite');

// Ensure database directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const sqlite = new Database(DB_PATH);

// Optimize SQLite for high concurrency & reliability
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('busy_timeout = 5000');
sqlite.pragma('foreign_keys = ON');

export const db = drizzle(sqlite, { schema });

const initialResources = [
  {
    id: 1,
    title: "Introduction to Computer Science (CS50)",
    description: "Harvard University's introduction to the intellectual enterprises of computer science and the art of programming.",
    type: "course",
    provider: "Harvard University / edX",
    category: "Courses",
    skills: ["C", "Python", "SQL", "HTML", "CSS", "JavaScript"],
    difficulty: "Beginner",
    duration: "12 weeks",
    isFree: true,
    url: "https://pll.harvard.edu/course/cs50-introduction-computer-science",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop",
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Google Data Analytics Professional Certificate",
    description: "Get professional training designed by Google and have the opportunity to connect with top employers.",
    type: "course",
    provider: "Google",
    category: "Courses",
    skills: ["Spreadsheets", "SQL", "Tableau", "R Programming"],
    difficulty: "Beginner",
    duration: "6 months",
    isFree: false,
    url: "https://grow.google/certificates/data-analytics/",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    title: "National Scholarship Portal",
    description: "Centralized portal for government scholarships across various schemes and ministries for Indian students.",
    type: "scholarship",
    provider: "Government of India",
    category: "Scholarships",
    amount: "Varies",
    deadline: "Check portal",
    isFree: true,
    url: "https://scholarships.gov.in/",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop",
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    title: "Frontend Developer Roadmap",
    description: "Step by step guide to becoming a modern frontend developer in 2024.",
    type: "roadmap",
    provider: "roadmap.sh",
    category: "Roadmaps",
    skills: ["HTML", "CSS", "JavaScript", "React", "Build Tools"],
    difficulty: "Intermediate",
    isFree: true,
    url: "https://roadmap.sh/frontend",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop",
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 5,
    title: "Software Engineering Intern",
    description: "Join our fast-paced engineering team as an intern and build features used by millions.",
    type: "internship",
    provider: "Tech Startup Inc.",
    category: "Internships",
    skills: ["React", "Node.js", "MongoDB"],
    location: "Remote / Bangalore",
    duration: "6 months",
    deadline: "Rolling",
    isFree: true,
    url: "https://example.com/internships",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
    featured: false,
    createdAt: new Date().toISOString()
  }
];

// Automatically create tables if not present
export function initDb() {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL DEFAULT 'user',
      password_hash TEXT NOT NULL,
      resume_text TEXT DEFAULT '',
      resume_data TEXT,
      education TEXT DEFAULT '',
      skills TEXT DEFAULT '',
      interests TEXT DEFAULT '',
      career_goal TEXT DEFAULT '',
      family_income TEXT DEFAULT '',
      assessment_completed INTEGER DEFAULT 0,
      last_recommendations TEXT,
      bookmarked_resources TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS resources (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      type TEXT NOT NULL,
      provider TEXT,
      category TEXT,
      skills TEXT,
      difficulty TEXT,
      duration TEXT,
      deadline TEXT,
      amount TEXT,
      location TEXT,
      is_free INTEGER DEFAULT 1,
      url TEXT,
      image TEXT,
      featured INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `);

  // Check if users table is empty and migrate from database.json if available
  const userCount = sqlite.prepare('SELECT COUNT(*) as count FROM users').get().count;
  const legacyJsonPath = path.join(__dirname, '../database.json');

  if (userCount === 0 && fs.existsSync(legacyJsonPath)) {
    try {
      const raw = fs.readFileSync(legacyJsonPath, 'utf8');
      const legacyData = JSON.parse(raw);
      if (Array.isArray(legacyData.users) && legacyData.users.length > 0) {
        const insertUser = sqlite.prepare(`
          INSERT OR IGNORE INTO users (
            id, name, email, role, password_hash, resume_text, resume_data,
            education, skills, interests, career_goal, family_income,
            assessment_completed, last_recommendations, bookmarked_resources, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const migrateTx = sqlite.transaction(() => {
          for (const u of legacyData.users) {
            insertUser.run(
              u._id || u.id || Date.now().toString(),
              u.name || '',
              (u.email || '').trim().toLowerCase(),
              u.role || 'user',
              u.passwordHash || '',
              u.resumeText || '',
              u.resumeData ? JSON.stringify(u.resumeData) : null,
              u.education || '',
              u.skills || '',
              u.interests || '',
              u.careerGoal || '',
              u.familyIncome || '',
              u.assessmentCompleted ? 1 : 0,
              u.lastRecommendations ? JSON.stringify(u.lastRecommendations) : null,
              JSON.stringify(Array.isArray(u.bookmarkedResources) ? u.bookmarkedResources : []),
              u.createdAt || new Date().toISOString()
            );
          }
        });
        migrateTx();
        logger.info(`Migrated ${legacyData.users.length} legacy users from database.json into SQLite.`);
      }
    } catch (err) {
      logger.warn('Could not migrate legacy database.json to SQLite:', err.message);
    }
  }

  // Seed default resources if empty
  const resourceCount = sqlite.prepare('SELECT COUNT(*) as count FROM resources').get().count;
  if (resourceCount === 0) {
    const insertResource = sqlite.prepare(`
      INSERT OR IGNORE INTO resources (
        id, title, description, type, provider, category, skills,
        difficulty, duration, deadline, amount, location, is_free, url, image, featured, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const seedTx = sqlite.transaction(() => {
      for (const r of initialResources) {
        insertResource.run(
          r.id,
          r.title,
          r.description,
          r.type,
          r.provider || '',
          r.category || '',
          JSON.stringify(r.skills || []),
          r.difficulty || '',
          r.duration || '',
          r.deadline || '',
          r.amount || '',
          r.location || '',
          r.isFree ? 1 : 0,
          r.url || '',
          r.image || '',
          r.featured ? 1 : 0,
          r.createdAt || new Date().toISOString()
        );
      }
    });
    seedTx();
    logger.info('Seeded initial resources into SQLite database.');
  }
}

// Automatically initialize tables on load
initDb();

export { schema };

