const jwt = require('jsonwebtoken');
const IJWTService = require('../../domain/services/IJWTService');

class JWTService extends IJWTService {
  constructor() {
    super();
    this.secret = process.env.JWT_SECRET;
    this.expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  }

  generateToken(payload) {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn
    });
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  getCookieOptions() {
    return {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    };
  }
}

module.exports = JWTService;
