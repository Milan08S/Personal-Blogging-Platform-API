const JWTService = require('../services/JWTService');

class AuthMiddleware {
  constructor(userRepository) {
    this.userRepository = userRepository;
    this.jwtService = new JWTService();
  }

  authenticate() {
    return async (req, res, next) => {
      try {
        const token = req.cookies.jwt;

        if (!token) {
          return res.status(401).json({
            success: false,
            error: 'Access denied. No token provided.'
          });
        }

        const decoded = this.jwtService.verifyToken(token);

        const user = await this.userRepository.findById(decoded.id);
        if (!user) {
          return res.status(401).json({
            success: false,
            error: 'User not found'
          });
        }

        req.user = user;
        next();

      } catch (error) {
        console.error('❌ Auth middleware error:', error);
        
        res.clearCookie('jwt');
        
        return res.status(401).json({
          success: false,
          error: 'Invalid or expired token'
        });
      }
    };
  }

  ownerOrAdmin() {
    return async (req, res, next) => {
      try {
        const userId = req.params.id;
        const currentUser = req.user;
        
        if (currentUser.id === userId || currentUser.role === 'admin') {
          next();
        } else {
          return res.status(403).json({
            success: false,
            error: 'Access denied. You can only modify your own profile.'
          });
        }
      } catch (error) {
        return res.status(500).json({
          success: false,
          error: 'Server error'
        });
      }
    };
  }

  requireRole(roles) {
    return async (req, res, next) => {
      try {
        const userRole = req.user.role;
        
        if (!roles.includes(userRole)) {
          return res.status(403).json({
            success: false,
            error: `Access denied. Required role: ${roles.join(' or ')}`
          });
        }
        
        next();
      } catch (error) {
        return res.status(500).json({
          success: false,
          error: 'Server error'
        });
      }
    };
  }

  optionalAuth() {
    return async (req, res, next) => {
      try {
        const token = req.cookies.jwt;

        if (token) {
          const decoded = this.jwtService.verifyToken(token);
          const user = await this.userRepository.findById(decoded.id);
          req.user = user;
        }

        next();
      } catch (error) {
        next();
      }
    };
  }
}

module.exports = AuthMiddleware;
