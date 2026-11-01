import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: text('role').notNull().default('user'),
  passwordHash: text('password_hash').notNull(),
  resumeText: text('resume_text').default(''),
  resumeData: text('resume_data', { mode: 'json' }),
  education: text('education').default(''),
  skills: text('skills').default(''),
  interests: text('interests').default(''),
  careerGoal: text('career_goal').default(''),
  familyIncome: text('family_income').default(''),
  assessmentCompleted: integer('assessment_completed', { mode: 'boolean' }).default(false),
  lastRecommendations: text('last_recommendations', { mode: 'json' }),
  bookmarkedResources: text('bookmarked_resources', { mode: 'json' }),
  createdAt: text('created_at').notNull()
});

export const resources = sqliteTable('resources', {
  id: integer('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  type: text('type').notNull(),
  provider: text('provider'),
  category: text('category'),
  skills: text('skills', { mode: 'json' }),
  difficulty: text('difficulty'),
  duration: text('duration'),
  deadline: text('deadline'),
  amount: text('amount'),
  location: text('location'),
  isFree: integer('is_free', { mode: 'boolean' }).default(true),
  url: text('url'),
  image: text('image'),
  featured: integer('featured', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').notNull()
});

