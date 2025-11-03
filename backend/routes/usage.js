const express = require('express');
const { verifyJwtDual } = require('../middleware/verifyJwtDual');
const { supabase } = require('../services/db');
const router = express.Router();

// Get user usage statistics
router.get('/', verifyJwtDual, async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Get usage counts for current month
    const { data: resumeUsage, error: resumeError } = await supabase
      .from('user_usage')
      .select('count')
      .eq('user_id', userId)
      .eq('usage_type', 'resume')
      .gte('created_at', startOfMonth.toISOString())
      .lt('created_at', nextMonth.toISOString())
      .single();

    const { data: coverLetterUsage, error: coverLetterError } = await supabase
      .from('user_usage')
      .select('count')
      .eq('user_id', userId)
      .eq('usage_type', 'cover_letter')
      .gte('created_at', startOfMonth.toISOString())
      .lt('created_at', nextMonth.toISOString())
      .single();

    const usage = {
      resumesThisMonth: resumeUsage?.count || 0,
      coverLettersThisMonth: coverLetterUsage?.count || 0,
      resetDate: nextMonth.toISOString()
    };

    res.json(usage);
  } catch (error) {
    console.error('Usage fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch usage data' });
  }
});

// Increment usage count
router.post('/increment', verifyJwtDual, async (req, res) => {
  try {
    const userId = req.user.id;
    const { type } = req.body;
    
    if (!['resume', 'coverLetter'].includes(type)) {
      return res.status(400).json({ error: 'Invalid usage type' });
    }

    const usageType = type === 'resume' ? 'resume' : 'cover_letter';
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Check if usage record exists for this month
    const { data: existingUsage, error: fetchError } = await supabase
      .from('user_usage')
      .select('id, count')
      .eq('user_id', userId)
      .eq('usage_type', usageType)
      .gte('created_at', startOfMonth.toISOString())
      .lt('created_at', nextMonth.toISOString())
      .single();

    if (existingUsage) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('user_usage')
        .update({ count: existingUsage.count + 1, updated_at: now.toISOString() })
        .eq('id', existingUsage.id);

      if (updateError) throw updateError;
    } else {
      // Create new record
      const { error: insertError } = await supabase
        .from('user_usage')
        .insert({
          user_id: userId,
          usage_type: usageType,
          count: 1,
          created_at: now.toISOString(),
          updated_at: now.toISOString()
        });

      if (insertError) throw insertError;
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Usage increment error:', error);
    res.status(500).json({ error: 'Failed to increment usage' });
  }
});

// Get tier limits for user
router.get('/limits', verifyJwtDual, async (req, res) => {
  try {
    const userTier = req.user.tier || 'free';
    
    const tierLimits = {
      free: {
        resumesPerMonth: 1,
        coverLettersPerMonth: 3,
        templatesAccess: 'basic',
        watermark: true
      },
      basic: {
        resumesPerMonth: 10,
        coverLettersPerMonth: 10,
        templatesAccess: 'all',
        watermark: false
      },
      professional: {
        resumesPerMonth: -1,
        coverLettersPerMonth: -1,
        templatesAccess: 'premium',
        watermark: false
      },
      enterprise: {
        resumesPerMonth: -1,
        coverLettersPerMonth: -1,
        templatesAccess: 'premium',
        watermark: false
      }
    };

    res.json({
      tier: userTier,
      limits: tierLimits[userTier] || tierLimits.free
    });
  } catch (error) {
    console.error('Limits fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch tier limits' });
  }
});

module.exports = router;