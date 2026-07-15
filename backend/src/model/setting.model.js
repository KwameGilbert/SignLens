import BaseModel from './base.model.js';

class SettingModel extends BaseModel {
  constructor() {
    super('settings', [
      'id',
      'key',
      'value',
      'createdAt',
      'updatedAt',
    ]);
  }

  async findByKey(key) {
    return this.findOne({ key });
  }

  async updateByKey(key, value) {
    const [updated] = await this.db(this.tableName)
      .where({ key })
      .update({ value, updatedAt: this.db.fn.now() })
      .returning(this.selectColumns);
    return updated;
  }
}

export default new SettingModel();
