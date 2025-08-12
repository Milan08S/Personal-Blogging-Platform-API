class GetUserByIdUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(userId) {
        try {
            const user = await this.userRepository.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            throw new Error(`Error fetching user by ID: ${error.message}`);
        }
    }
}

module.exports = GetUserByIdUseCase;