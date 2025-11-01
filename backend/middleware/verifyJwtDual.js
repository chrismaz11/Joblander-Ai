import jwt from 'jsonwebtoken';

/**
 * Middleware factory to verify JWTs with a primary and optional legacy secret.
 * Use during key rotation to accept tokens signed with either secret.
 */
export function verifyJwtDual(primarySecret, legacySecret) {
  return (req, res, next) => {
    const auth = req.headers.authorization || req.headers.Authorization;
    if (!auth || !String(auth).startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing Authorization header' });
    }

    const token = String(auth).slice(7);

    const tryVerify = (secret) => {
      try {
        return jwt.verify(token, secret);
      } catch (e) {
        return null;
      }
    };

    const payloadPrimary = primarySecret ? tryVerify(primarySecret) : null;
    if (payloadPrimary) {
      req.user = payloadPrimary;
      req.authUsed = 'primary';
      return next();
    }

    if (legacySecret) {
      const payloadLegacy = tryVerify(legacySecret);
      if (payloadLegacy) {
        req.user = payloadLegacy;
        req.authUsed = 'legacy';
        console.warn('[auth] legacy JWT secret used for token verification', { sub: payloadLegacy.sub || payloadLegacy.user_id });
        return next();
      }
    }

    return res.status(401).json({ error: 'Invalid token' });
  };
}

export default verifyJwtDual;
