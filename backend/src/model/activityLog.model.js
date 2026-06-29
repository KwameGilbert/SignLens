import BaseModel from './base.model.js';

class ActivityLogModel extends BaseModel {
  constructor() {
    super('activityLogs', [
      'id',
      'userId',
      'eventDescription',
      'category',
      'before',
      'after',
      'createdAt',
    ]);
  }

  // Override create to support JSON serialization for before/after
  async create(data) {
    if (data) {
      if (data.before && typeof data.before !== 'string') {
        data.before = JSON.stringify(data.before);
      }
      if (data.after && typeof data.after !== 'string') {
        data.after = JSON.stringify(data.after);
      }
    }
    return super.create(data);
  }

  async findByUserId(userId, limit = 20, offset = 0) {
    return this.find({ userId }, { limit, offset, orderBy: 'createdAt', orderDir: 'desc' });
  }
}

export default new ActivityLogModel();
