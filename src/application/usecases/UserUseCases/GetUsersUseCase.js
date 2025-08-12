class GetUsersUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute() {
        try {
            const users = await this.userRepository.findAll();
            return users.map(user => user.toJSON());
        } catch (error) {
            throw new Error('Database error while fetching users');
        } 
    }
}

module.exports = GetUsersUseCase;