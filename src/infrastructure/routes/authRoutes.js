const express = require('express');
const DIContainer = require('../config/DIContainer');

function createAuthRoutes() {
  const router = express.Router();
  const container = new DIContainer();

  const authController = container.get('authController');
  const authMiddleware = container.get('authMiddleware');

  router.post('/register', authController.register.bind(authController));
  router.post('/login', authController.login.bind(authController));
  router.post('/logout', authController.logout.bind(authController));

  router.get('/profile', 
    authMiddleware.authenticate(), 
    authController.getProfile.bind(authController)
  );

  return router;
}

module.exports = createAuthRoutes;
