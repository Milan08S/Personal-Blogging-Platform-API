class UserDIConfig {
  static register(container) {

    const UserRepository = require('../../repositories/UserRepository');
    const userRepository = new UserRepository();
    container.register('userRepository', userRepository);

    const CreateUserUseCase = require('../../../application/usecases/UserUseCases/CreateUserUseCase');
    const UpdateUserProfileUseCase = require('../../../application/usecases/UserUseCases/UpdateUserProfileUseCase');
    const DeactivateUserUseCase = require('../../../application/usecases/UserUseCases/DeactivateUserUseCase');
    const GetUserByIdUseCase = require('../../../application/usecases/UserUseCases/GetUserByIdUseCase');
    const GetUsersUseCase = require('../../../application/usecases/UserUseCases/GetUsersUseCase');
    const ActivateUserUseCase = require('../../../application/usecases/UserUseCases/ActivateUserUseCase');

    container.register('createUserUseCase', new CreateUserUseCase(userRepository));
    container.register('updateUserProfileUseCase', new UpdateUserProfileUseCase(userRepository));
    container.register('deactivateUserUseCase', new DeactivateUserUseCase(userRepository));
    container.register('getUserByIdUseCase', new GetUserByIdUseCase(userRepository));
    container.register('getUsersUseCase', new GetUsersUseCase(userRepository));
    container.register('activateUserUseCase', new ActivateUserUseCase(userRepository));

    const UserController = require('../../controllers/UserController');
    const userController = new UserController(
      container.get('createUserUseCase'),
      container.get('updateUserProfileUseCase'),
      container.get('deactivateUserUseCase'),
      container.get('getUserByIdUseCase'),
      container.get('getUsersUseCase'),
      container.get('activateUserUseCase'),
      userRepository
    );
    
    container.register('userController', userController);
    
  }
}

module.exports = UserDIConfig;
