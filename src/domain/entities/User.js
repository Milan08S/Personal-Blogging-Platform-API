const bcrypt = require('bcryptjs');

class User {
  constructor({ id, email, password, firstName, lastName, createdAt}) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.createdAt = createdAt || new Date();
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  updateProfile(data) {
    const updatableFields = ['firstName', 'lastName', 'email'];
    updatableFields.forEach(field => {
      if (data[field] !== undefined) {
        this[field] = data[field];
      }
    });
  }

  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 12);
    }
  }

  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidPassword(password) {
    return password && password.length >= 6;
  }

  static fromDatabase(row) {
    return new User({
      id: row.iduser,
      email: row.email,
      password: row.password,
      firstName: row.first_name,
      lastName: row.last_name,
      createdAt: row.created_at,
    });
  }

  toDatabase() {
    return {
      iduser: this.id,
      email: this.email,
      password: this.password,
      first_name: this.firstName,
      last_name: this.lastName,
      created_at: this.createdAt,
    };
  }
}

module.exports = User;