import { Router } from 'express';
import { verifyJwtDual } from '../middleware/verifyJwtDual.js';

const router = Router();

// Protected route example using verifyJwtDual middleware
router.get('/me', 
  verifyJwtDual(process.env.JWT_SECRET, process.env.LEGACY_JWT_SECRET),
  async (req, res) => {
    try {
      // User data is already verified and available in req.user
      const userData = {
        id: req.user.id,
        email: req.user.email,
        authMethod: req.authUsed // 'supabase' or 'legacy'
      };

      res.json({
        user: userData,
        message: 'Protected route accessed successfully'
      });
    } catch (error) {
      console.error('Error in /me route:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        details: error.message 
      });
    }
  }
);

// Example protected data route
router.get('/my-data',
  verifyJwtDual(process.env.JWT_SECRET, process.env.LEGACY_JWT_SECRET),
  async (req, res) => {
    try {
      // Example of using the user ID from the verified token
      const userId = req.user.id;
      
      // Log which auth method was used
      console.log(`User ${userId} accessed /my-data using ${req.authUsed} auth`);
      
      res.json({
        message: 'Data retrieved successfully',
        data: {
          userId,
          timestamp: new Date(),
          authMethod: req.authUsed
        }
      });
    } catch (error) {
      console.error('Error in /my-data route:', error);
      res.status(500).json({ error: 'Failed to retrieve data' });
    }
  }
);

export default router;