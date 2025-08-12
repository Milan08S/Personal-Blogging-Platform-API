class AuthDIConfig {
  static register(container) {
    const JWTService = require('../../services/JWTService');
    const jwtService = new JWTService();
    container.register('jwtService', jwtService);

    const RegisterUseCase = require('../../../application/usecases/AuthUseCases/RegisterUseCase');
    const LoginUseCase = require('../../../application/usecases/AuthUseCases/LoginUseCase');
    const GetProfileUseCase = require('../../../application/usecases/AuthUseCases/GetProfileUseCase');

    const userRepository = container.get('userRepository');
    
    const registerUseCase = new RegisterUseCase(userRepository, jwtService);
    const loginUseCase = new LoginUseCase(userRepository, jwtService);
    const getProfileUseCase = new GetProfileUseCase(userRepository);

    container.register('registerUseCase', registerUseCase);
    container.register('loginUseCase', loginUseCase);
    container.register('getProfileUseCase', getProfileUseCase);

    const AuthController = require('../../controllers/AuthController');
    const authController = new AuthController(
      registerUseCase,
      loginUseCase,
      getProfileUseCase,
      jwtService
    );
    container.register('authController', authController);

    const AuthMiddleware = require('../../middleware/authMiddleware');
    const authMiddleware = new AuthMiddleware(userRepository);
    container.register('authMiddleware', authMiddleware);
    
  }
}

module.exports = AuthDIConfig;
