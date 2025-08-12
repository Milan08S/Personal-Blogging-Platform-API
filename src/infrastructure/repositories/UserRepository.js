const BaseRepository = require('./BaseRepository');
const IUserRepository = require('../../domain/repositories/IUserRepository');
const User = require('../../domain/entities/User');

class UserRepository extends BaseRepository {
  constructor() {
    super('user', User);
    this._validateInterface();
  }

  getPrimaryKey() {
    return 'iduser';
  }

  async findByEmail(email) {
    try {
      const users = await this.findBy('email', email);
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      throw error;
    }
  }

  async findByUsername(username) {
    try {
      const user = await this.findBy('username', username);
      return user.length > 0 ? user[0] : null;
    } catch (error) {
      throw error;
    }
  }

  async findByFullName(firstName, lastName) {
    try {
      const pool = await this.getPool();
      const [rows] = await pool.execute(
        'SELECT * FROM user WHERE firstName = ? AND lastName = ?',
        [firstName, lastName]
      );
      
      return rows.map(row => User.fromDatabase(row));
    } catch (error) {
      throw new Error('Database error while searching users by name');
    }
  }

  async emailExists(email) {
    try {
      const user = await this.findByEmail(email);
      return user !== null;
    } catch (error) {
      return false;
    }
  }

    _validateInterface() {
    const userInterface = new IUserRepository();
    
    const requiredMethods = Object.getOwnPropertyNames(IUserRepository.prototype)
      .filter(method => method !== 'constructor');
    
    requiredMethods.forEach(method => {
      if (typeof this[method] !== 'function') {
        throw new Error(`UserRepository must implement method: ${method}`);
      }
    });
  }
}

module.exports = UserRepository;