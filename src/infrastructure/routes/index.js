const express = require('express');
const router = express.Router();

const createUserRoutes = require('./userRoutes');
const createAuthRoutes = require('./authRoutes');

router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the User Management API',
    version: '1.0.0'
  });
});

router.use('/users', createUserRoutes());
router.use('/auth', createAuthRoutes());

module.exports = router;
