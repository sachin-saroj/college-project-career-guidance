import { eq } from 'drizzle-orm';
import { db, sqlite, schema } from './db/index.js';
import { users, resources } from './db/schema.js';

export { db, sqlite, schema, users, resources };

/**
 * Normalizes user record from SQLite/Drizzle to match expected application shape,
 * ensuring dual availability of `id` and `_id`.
 */
function normalizeUser(u) {
  if (!u) return null;
  return {
    ...u,
    _id: u.id,
    resumeText: u.resumeText || '',
    resumeData: u.resumeData || null,
    education: u.education || '',
    skills: u.skills || '',
    interests: u.interests || '',
    careerGoal: u.careerGoal || '',
    familyIncome: u.familyIncome || '',
    assessmentCompleted: Boolean(u.assessmentCompleted),
    lastRecommendations: u.lastRecommendations || null,
    bookmarkedResources: Array.isArray(u.bookmarkedResources) ? u.bookmarkedResources : []
  };
}

/**
 * Normalizes resource record from SQLite/Drizzle
 */
function normalizeResource(r) {
  if (!r) return null;
  return {
    ...r,
    id: Number(r.id),
    skills: Array.isArray(r.skills) ? r.skills : [],
    isFree: Boolean(r.isFree),
    featured: Boolean(r.featured)
  };
}

/**
 * Retrieve all users and resources from SQLite via Drizzle ORM
 */
export async function getUsers() {
  try {
    const rawUsers = db.select().from(users).all();
    const rawResources = db.select().from(resources).all();

    return {
      users: rawUsers.map(normalizeUser),
      resources: rawResources.map(normalizeResource)
    };
  } catch (err) {
    return { users: [], resources: [] };
  }
}

/**
 * Persist users and resources into SQLite atomically via Drizzle ORM
 */
export async function saveUsers(data) {
  if (!data) return;

  const syncTx = sqlite.transaction(() => {
    // 1. Sync Users
    if (Array.isArray(data.users)) {
      const incomingIds = new Set();

      for (const u of data.users) {
        const userId = (u.id || u._id || '').toString();
        if (!userId) continue;
        incomingIds.add(userId);

        const record = {
          id: userId,
          name: u.name || '',
          email: (u.email || '').trim().toLowerCase(),
          role: u.role || 'user',
          passwordHash: u.passwordHash || '',
          resumeText: u.resumeText || '',
          resumeData: u.resumeData || null,
          education: u.education || '',
          skills: u.skills || '',
          interests: u.interests || '',
          careerGoal: u.careerGoal || '',
          familyIncome: u.familyIncome || '',
          assessmentCompleted: Boolean(u.assessmentCompleted),
          lastRecommendations: u.lastRecommendations || null,
          bookmarkedResources: Array.isArray(u.bookmarkedResources) ? u.bookmarkedResources : [],
          createdAt: u.createdAt || new Date().toISOString()
        };

        db.insert(users)
          .values(record)
          .onConflictDoUpdate({
            target: users.id,
            set: {
              name: record.name,
              email: record.email,
              role: record.role,
              passwordHash: record.passwordHash,
              resumeText: record.resumeText,
              resumeData: record.resumeData,
              education: record.education,
              skills: record.skills,
              interests: record.interests,
              careerGoal: record.careerGoal,
              familyIncome: record.familyIncome,
              assessmentCompleted: record.assessmentCompleted,
              lastRecommendations: record.lastRecommendations,
              bookmarkedResources: record.bookmarkedResources,
              createdAt: record.createdAt
            }
          })
          .run();
      }

      // Remove deleted users
      if (incomingIds.size > 0) {
        const existingUsers = db.select({ id: users.id }).from(users).all();
        for (const existing of existingUsers) {
          if (!incomingIds.has(existing.id)) {
            db.delete(users).where(eq(users.id, existing.id)).run();
          }
        }
      }
    }

    // 2. Sync Resources
    if (Array.isArray(data.resources)) {
      const incomingResourceIds = new Set();

      for (const r of data.resources) {
        const resId = Number(r.id);
        if (!resId) continue;
        incomingResourceIds.add(resId);

        const resRecord = {
          id: resId,
          title: r.title || '',
          description: r.description || '',
          type: r.type || '',
          provider: r.provider || '',
          category: r.category || '',
          skills: Array.isArray(r.skills) ? r.skills : [],
          difficulty: r.difficulty || '',
          duration: r.duration || '',
          deadline: r.deadline || '',
          amount: r.amount || '',
          location: r.location || '',
          isFree: r.isFree !== undefined ? Boolean(r.isFree) : true,
          url: r.url || '',
          image: r.image || '',
          featured: Boolean(r.featured),
          createdAt: r.createdAt || new Date().toISOString()
        };

        db.insert(resources)
          .values(resRecord)
          .onConflictDoUpdate({
            target: resources.id,
            set: {
              title: resRecord.title,
              description: resRecord.description,
              type: resRecord.type,
              provider: resRecord.provider,
              category: resRecord.category,
              skills: resRecord.skills,
              difficulty: resRecord.difficulty,
              duration: resRecord.duration,
              deadline: resRecord.deadline,
              amount: resRecord.amount,
              location: resRecord.location,
              isFree: resRecord.isFree,
              url: resRecord.url,
              image: resRecord.image,
              featured: resRecord.featured,
              createdAt: resRecord.createdAt
            }
          })
          .run();
      }

      // Remove deleted resources
      if (incomingResourceIds.size > 0) {
        const existingResources = db.select({ id: resources.id }).from(resources).all();
        for (const existing of existingResources) {
          if (!incomingResourceIds.has(existing.id)) {
            db.delete(resources).where(eq(resources.id, existing.id)).run();
          }
        }
      }
    }
  });

  syncTx();
}
