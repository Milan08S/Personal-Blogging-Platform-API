const IBaseRepository = require('../../domain/repositories/IBaseRepository');
const dbConnection = require('../database/DatabaseConnection');

class BaseRepository extends IBaseRepository{
  constructor(tableName, entityClass) {
    super(); 
    this.tableName = tableName;
    this.EntityClass = entityClass;
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000;
  }

  async findAll(orderBy = 'createdAt', order = 'DESC') {
    try {
      const pool = await dbConnection.getPool();
      const [rows] = await pool.execute(
        `SELECT * FROM ${this.tableName} ORDER BY ${orderBy} ${order}`
      );
      
      return rows.map(row => this.EntityClass.fromDatabase(row));
    } catch (error) {
      console.error(`❌ Error in findAll (${this.tableName}):`, error);
      throw new Error(`Database error while fetching ${this.tableName}`);
    }
  }

  async findById(id) {
    try {
      const cacheKey = `${this.tableName}_${id}`;
      const cached = this.cache.get(cacheKey);
      
      if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
        console.log(`✅ Cache HIT for ${this.tableName}:`, id);
        return cached.data;
      }

      const pool = await dbConnection.getPool();
      const [rows] = await pool.execute(
        `SELECT * FROM ${this.tableName} WHERE ${this.getPrimaryKey()} = ?`,
        [id]
      );
      
      if (rows.length === 0) {
        return null;
      }
      
      const entity = this.EntityClass.fromDatabase(rows[0]);
      
      this.cache.set(cacheKey, {
        data: entity,
        timestamp: Date.now()
      });
      
      return entity;
    } catch (error) {
      console.error(`❌ Error in findById (${this.tableName}):`, error);
      throw new Error(`Database error while fetching ${this.tableName}`);
    }
  }

  async create(entityData) {
    try {
      const pool = await dbConnection.getPool();
      
      const dbData = entityData.toDatabase ? entityData.toDatabase() : entityData;
      
      const fields = Object.keys(dbData).filter(key => key !== this.getPrimaryKey());
      const placeholders = fields.map(() => '?').join(', ');
      const values = fields.map(field => dbData[field]);
      
      const [result] = await pool.execute(
        `INSERT INTO ${this.tableName} (${fields.join(', ')}) VALUES (${placeholders})`,
        values
      );
      
      return await this.findById(result.insertId);
    } catch (error) {
      console.error(`❌ Error in create (${this.tableName}):`, error);
      
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error(`Duplicate entry for ${this.tableName}`);
      }
      
      throw new Error(`Database error while creating ${this.tableName}`);
    }
  }

  async update(id, updateData) {
    try {
      const pool = await dbConnection.getPool();
      
      const existingEntity = await this.findById(id);
      if (!existingEntity) {
        throw new Error(`${this.tableName} not found`);
      }

      const fieldsToUpdate = [];
      const values = [];
      
      Object.keys(updateData).forEach(field => {
        if (updateData[field] !== undefined && field !== this.getPrimaryKey()) {
          fieldsToUpdate.push(`${field} = ?`);
          values.push(updateData[field]);
        }
      });
      
      if (fieldsToUpdate.length === 0) {
        return existingEntity;
      }
      
      values.push(id);
      
      await pool.execute(
        `UPDATE ${this.tableName} SET ${fieldsToUpdate.join(', ')} WHERE ${this.getPrimaryKey()} = ?`,
        values
      );
      
      this.cache.delete(`${this.tableName}_${id}`);
      
      return await this.findById(id);
    } catch (error) {
      console.error(`❌ Error in update (${this.tableName}):`, error);
      throw new Error(`Database error while updating ${this.tableName}`);
    }
  }

  async delete(id) {
    try {
      const pool = await dbConnection.getPool();
      
      const existingEntity = await this.findById(id);
      if (!existingEntity) {
        throw new Error(`${this.tableName} not found`);
      }
      
      const [result] = await pool.execute(
        `DELETE FROM ${this.tableName} WHERE ${this.getPrimaryKey()} = ?`,
        [id]
      );
      
      // Invalidar cache
      this.cache.delete(`${this.tableName}_${id}`);
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`❌ Error in delete (${this.tableName}):`, error);
      throw new Error(`Database error while deleting ${this.tableName}`);
    }
  }

  async findBy(field, value) {
    try {
      const pool = await dbConnection.getPool();
      const [rows] = await pool.execute(
        `SELECT * FROM ${this.tableName} WHERE ${field} = ?`,
        [value]
      );
      
      return rows.map(row => this.EntityClass.fromDatabase(row));
    } catch (error) {
      console.error(`❌ Error in findBy (${this.tableName}):`, error);
      throw new Error(`Database error while searching ${this.tableName}`);
    }
  }

  async count() {
    try {
      const pool = await dbConnection.getPool();
      const [rows] = await pool.execute(`SELECT COUNT(*) as total FROM ${this.tableName}`);
      return rows[0].total;
    } catch (error) {
      console.error(`❌ Error in count (${this.tableName}):`, error);
      throw new Error(`Database error while counting ${this.tableName}`);
    }
  }

  async exists(id) {
    try {
      const entity = await this.findById(id);
      return entity !== null;
    } catch (error) {
      return false;
    }
  }

  getPrimaryKey() {
    return 'id';
  }
}

module.exports = BaseRepository;