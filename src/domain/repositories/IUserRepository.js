const IBaseRepository = require('./IBaseRepository');

class IUserRepository extends IBaseRepository {
  constructor() {
    super();
  }

  async findByEmail(email) {
    throw new Error('Method findByEmail must be implemented');
  }

  async findByUsername(username) {
    throw new Error('Method findByUsername must be implemented');
  }

  async emailExists(email) {
    throw new Error('Method emailExists must be implemented');
  }

  async findByFullName(firstName, lastName) {
    throw new Error('Method findByFullName must be implemented');
  }
}

module.exports = IUserRepository;