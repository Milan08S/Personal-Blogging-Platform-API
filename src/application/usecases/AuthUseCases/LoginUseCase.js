class LoginUseCase {
  constructor(userRepository, jwtService) { 
    this.userRepository = userRepository;
    this.jwtService = jwtService;
  }

  async execute(credentials) {
    const { email, password } = credentials;

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = this.jwtService.generateToken({
      id: user.id,
      email: user.email
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.getFullName(),
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt
      }
    };
  }
}

module.exports = LoginUseCase;
