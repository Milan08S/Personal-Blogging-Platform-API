class IBaseRepository {
  constructor() {
    if (this.constructor === IBaseRepository) {
      throw new Error('Cannot instantiate abstract class IBaseRepository');
    }
  }

  async findAll(orderBy, order) {
    throw new Error('Method findAll must be implemented');
  }

  async findById(id) {
    throw new Error('Method findById must be implemented');
  }

  async create(entityData) {
    throw new Error('Method create must be implemented');
  }

  async update(id, updateData) {
    throw new Error('Method update must be implemented');
  }

  async delete(id) {
    throw new Error('Method delete must be implemented');
  }

  async findBy(field, value) {
    throw new Error('Method findBy must be implemented');
  }

  async count() {
    throw new Error('Method count must be implemented');
  }

  async exists(id) {
    throw new Error('Method exists must be implemented');
  }

  getPrimaryKey() {
    throw new Error('Method getPrimaryKey must be implemented');
  }
}

module.exports = IBaseRepository;