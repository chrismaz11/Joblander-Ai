import { db } from '../db';
import { users, usageTracking } from '../../shared/schema';
import { eq, and, gte } from 'drizzle-orm';

const TIER_LIMITS = {
  free: { resumesPerMonth: 1, templatesAccess: 'basic', coverLetters: false, watermark: true },
  basic: { resumesPerMonth: 5, templatesAccess: 'all', coverLetters: true, watermark: false },
  professional: { resumesPerMonth: -1, templatesAccess: 'premium', coverLetters: true, watermark: false },
  enterprise: { resumesPerMonth: -1, templatesAccess: 'premium', coverLetters: true, watermark: false }
};

export function getTierLimits(tier: string) {
  return TIER_LIMITS[tier as keyof typeof TIER_LIMITS] || TIER_LIMITS.free;
}

export function canCreateResume(tier: string, currentUsage: number) {
  const limits = getTierLimits(tier);
  return limits.resumesPerMonth === -1 || currentUsage < limits.resumesPerMonth;
}

export function canAccessTemplate(tier: string, templateTier: string) {
  const limits = getTierLimits(tier);
  if (limits.templatesAccess === 'premium') return true;
  if (limits.templatesAccess === 'all') return templateTier !== 'premium';
  return templateTier === 'basic';
}

export async function checkUserUsage(userId: string) {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const usage = await db.select()
    .from(usageTracking)
    .where(
      and(
        eq(usageTracking.userId, userId),
        eq(usageTracking.action, 'resume_created'),
        gte(usageTracking.createdAt, startOfMonth)
      )
    );

  const nextMonth = new Date(startOfMonth);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  return {
    resumesThisMonth: usage.length,
    resetDate: nextMonth.toISOString()
  };
}

export async function getUserTier(userId: string) {
  const user = await db.select({ tier: users.tier })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return user[0]?.tier || 'free';
}

export async function incrementUserUsage(userId: string, action: string) {
  const usageRecord: typeof usageTracking.$inferInsert = {
    userId,
    action,
    count: '1'
  };

  await db.insert(usageTracking).values(usageRecord);
}
