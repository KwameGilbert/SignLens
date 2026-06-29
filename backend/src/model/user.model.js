import BaseModel from './base.model.js';

class UserModel extends BaseModel {
  constructor() {
    super('users', [
      'id',
      'firstName',
      'lastName',
      'email',
      'passwordHash',
      'status',
      'profile',
      'role',
      'createdAt',
      'updatedAt',
    ]);
  }

  async findByEmail(email, includePassword = false) {
    if (includePassword) {
      return this.db(this.tableName).where({ email }).first();
    }
    return this.findOne({ email });
  }

  async listAll() {
    return this.findAll();
  }
}

export default new UserModel();
