const User = require('../models/User');

module.exports = function (allowedRoles = []) {
  return async function (req, res, next) {
    // Skip middleware for login route to allow unauthenticated access
    if (req.path === '/api/auth/login' || req.path === '/api/auth/signup') {
      return next();
    }

    console.log('\n🔐 Auth Middleware Check');
    console.log('➡️ Request Path:', req.path);
    console.log('📦 Session ID:', req.sessionID);
    console.log('👤 Session User:', req.session?.user || 'None');
    console.log('🍪 Cookies:', req.headers.cookie || 'None');

    // Check if session user exists
    if (!req.session?.user) {
      console.log('⛔ No active session');
      return res.status(401).json({
        success: false,
        code: 'NO_SESSION',
        message: 'Please login to continue',
      });
    }

    try {
      // Verify user exists in DB
      const user = await User.findById(req.session.user.id).lean();
      if (!user) {
        console.log('⛔ User not found in DB. Destroying session.');
        req.session.destroy(() => {});
        return res.status(401).json({
          success: false,
          code: 'USER_NOT_FOUND',
          message: 'User no longer exists',
        });
      }

      console.log(`🔑 User Role: ${user.role}`);
      console.log(`🛡️ Required Roles: ${allowedRoles.length ? allowedRoles.join(', ') : 'Any'}`);

      // Check role if roles specified
      if (allowedRoles.length && !allowedRoles.includes(user.role)) {
        console.log('⛔ Access denied: insufficient role');
        return res.status(403).json({
          success: false,
          code: 'ACCESS_DENIED',
          message: 'You do not have permission to access this resource',
          requiredRoles: allowedRoles,
          currentRole: user.role,
        });
      }

      // Update session user info & lastActive timestamp
      req.session.user = {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        lastActive: new Date(),
      };

      // Save session updates
      await new Promise((resolve, reject) => {
        req.session.save(err => {
          if (err) {
            console.error('⚠️ Session save error:', err);
            return reject(err);
          }
          console.log('✅ Session saved successfully');
          resolve();
        });
      });

      console.log('✅ Access granted');
      next();
    } catch (err) {
      console.error('❌ Middleware auth error:', err);
      return res.status(500).json({
        success: false,
        code: 'AUTH_MIDDLEWARE_ERROR',
        message: 'Internal authentication error',
      });
    }
  };
};
