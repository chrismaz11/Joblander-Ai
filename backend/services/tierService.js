const TIER_LIMITS = {
  free: {
    resumesPerMonth: 3,
    coverLettersPerMonth: 3,
  },
  pro: {
    resumesPerMonth: 50,
    coverLettersPerMonth: 50,
  },
  enterprise: {
    resumesPerMonth: Number.MAX_SAFE_INTEGER,
    coverLettersPerMonth: Number.MAX_SAFE_INTEGER,
  },
};

export function getTierLimits(tier = "free") {
  return TIER_LIMITS[tier] ?? TIER_LIMITS.free;
}

export function canCreateResume(tier, usageCount) {
  const limits = getTierLimits(tier);
  return usageCount < limits.resumesPerMonth;
}

export function canCreateCoverLetter(tier, usageCount) {
  const limits = getTierLimits(tier);
  return usageCount < limits.coverLettersPerMonth;
}
