const User = require('../../../domain/entities/User');

class RegisterUseCase {
  constructor(userRepository, jwtService) {
    this.userRepository = userRepository;
    this.jwtService = jwtService;
  }

  async execute(userData) {
    const { email, password, firstName, lastName } = userData;

    if (!User.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }

    if (!User.isValidPassword(password)) {
      throw new Error('Password must be at least 6 characters');
    }

    const emailExists = await this.userRepository.emailExists(email);
    if (emailExists) {
      throw new Error('Email already registered');
    }

    const user = new User({
      email,
      password,
      firstName,
      lastName
    });

    await user.hashPassword();

    const savedUser = await this.userRepository.create(user);

    const token = this.jwtService.generateToken({
      id: savedUser.id,
      email: savedUser.email
    });

    return {
      token,
      user: {
        id: savedUser.id,
        email: savedUser.email,
        fullName: savedUser.getFullName(),
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        createdAt: savedUser.createdAt
      }
    };
  }
}

module.exports = RegisterUseCase;
