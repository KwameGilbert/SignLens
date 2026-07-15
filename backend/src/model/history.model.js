import BaseModel from './base.model.js';

class HistoryModel extends BaseModel {
  constructor() {
    super('translationLogs', [
      'id',
      'userId',
      'mode',
      'prediction',
      'confidenceRating',
      'resolutionStatus',
      'createdAt',
    ]);
  }

  async findByUserId(userId, limit = 20, offset = 0) {
    return this.find({ userId }, { limit, offset, orderBy: 'createdAt', orderDir: 'desc' });
  }

  async findAll(limit = 50, offset = 0) {
    return this.db(this.tableName)
      .join('users', `${this.tableName}.userId`, 'users.id')
      .select(
        `${this.tableName}.*`,
        'users.email',
        'users.firstName',
        'users.lastName'
      )
      .orderBy(`${this.tableName}.createdAt`, 'desc')
      .limit(limit)
      .offset(offset);
  }
}

export default new HistoryModel();
