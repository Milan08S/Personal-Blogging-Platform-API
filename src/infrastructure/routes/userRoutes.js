const express = require('express');
const { validateUserData } = require('../middleware/validation');
const DIContainer = require('../config/DIContainer');

function createUserRoutes() {
  const router = express.Router();
  const container = new DIContainer();
  
  const userController = container.get('userController');
  const authMiddleware = container.get('authMiddleware');

  router.get('/', userController.getUsers.bind(userController));
  router.get('/:id', userController.getUserById.bind(userController));
  
  router.post('/', 
    authMiddleware.authenticate(), 
    validateUserData, 
    userController.createUser.bind(userController)
  );
  
  router.put('/:id', 
    authMiddleware.authenticate(),
    authMiddleware.ownerOrAdmin(),
    userController.updateUser.bind(userController)
  );
  
  router.delete('/:id', 
    authMiddleware.authenticate(),
    authMiddleware.requireRole(['admin']),
    userController.deleteUser.bind(userController)
  );

  return router;
}

module.exports = createUserRoutes;
