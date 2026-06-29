import BaseModel from './base.model.js';

class LessonCategoryModel extends BaseModel {
  constructor() {
    super('lessonCategories', [
      'id',
      'name',
      'slug',
      'icon',
      'createdAt',
      'updatedAt',
    ]);
  }
}

export default new LessonCategoryModel();
