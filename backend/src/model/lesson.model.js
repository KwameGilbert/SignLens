import BaseModel from './base.model.js';

class LessonModel extends BaseModel {
  constructor() {
    super('lessons', [
      'id',
      'title',
      'categoryId',
      'type',
      'slug',
      'lessonUrl',
      'description',
      'instructions',
      'createdAt',
      'updatedAt',
    ]);
  }

  // Override create to support JSON serialization for instructions
  async create(data) {
    if (data && data.instructions && typeof data.instructions !== 'string') {
      data.instructions = JSON.stringify(data.instructions);
    }
    return super.create(data);
  }

  async findByCategoryId(categoryId) {
    return this.find({ categoryId });
  }
}

export default new LessonModel();
