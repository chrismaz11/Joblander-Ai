import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { getDb } from '../services/db.js';
import { authAudit } from '../drizzle/schema.js';
import { createClient } from '@supabase/supabase-js';

/**
 * Middleware factory to verify JWTs with Supabase JWT verification and optional legacy support.
 * Use during key rotation to accept tokens signed with either Supabase's current key or a legacy key.
 */
export function verifyJwtDual(primarySecret, legacySecret) {
  const supabase = process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    : null;

  return async (req, res, next) => {
    const auth = req.headers.authorization || req.headers.Authorization;
    if (!auth || !String(auth).startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing Authorization header' });
    }

    const token = String(auth).slice(7);

    // Try Supabase JWT verification first (only if client configured)
    try {
      if (supabase) {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (user && !error) {
          req.user = user;
          req.authUsed = 'supabase';
          return next();
        }
      }
    } catch (e) {
      // Fall through to legacy verification
    }

    // Only try legacy verification if a legacy secret is provided
    if (legacySecret) {
      try {
        const payloadLegacy = jwt.verify(token, legacySecret);
        if (payloadLegacy) {
          req.user = payloadLegacy;
          req.authUsed = 'legacy';
          console.warn('[auth] legacy JWT secret used for token verification', { 
            sub: payloadLegacy.sub || payloadLegacy.user_id 
          });
          
          // Record audit event if DB is available
          try {
            const db = getDb();
            if (db) {
              await db.insert(authAudit).values({
                id: randomUUID(),
                userId: payloadLegacy.sub || payloadLegacy.user_id || null,
                usedAt: new Date(),
                route: req.path,
                ip: req.ip || req.headers['x-forwarded-for'] || null,
                method: req.method,
                note: 'legacy_jwt_used'
              }).returning();
            }
          } catch (err) {
            // do not block auth on audit failures
            console.error('[auth] failed to write audit record', err?.message || err);
          }
          return next();
        }
      } catch (e) {
        // Invalid legacy token
      }
    }

    return res.status(401).json({ error: 'Invalid token' });
  };
}

export default verifyJwtDual;
