class IJWTService {
  constructor() {
    if (this.constructor === IJWTService) {
      throw new Error('Cannot instantiate abstract class IJWTService');
    }
  }

  generateToken(payload) {
    throw new Error('Method generateToken must be implemented');
  }

  verifyToken(token) {
    throw new Error('Method verifyToken must be implemented');
  }

  getCookieOptions() {
    throw new Error('Method getCookieOptions must be implemented');
  }
}

module.exports = IJWTService;
