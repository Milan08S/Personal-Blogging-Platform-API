class GetProfileUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId) {
    if (!userId || userId <= 0) {
      throw new Error('Invalid user ID');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.getFullName(),
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt
    };
  }
}

module.exports = GetProfileUseCase;
