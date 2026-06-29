import BaseModel from './base.model.js';

class QuizModel extends BaseModel {
  constructor() {
    super('quizzes', [
      'id',
      'categoryId',
      'lessonId',
      'question',
      'createdAt',
      'updatedAt',
    ]);
  }

  async findByLessonId(lessonId) {
    return this.find({ lessonId });
  }
}

export default new QuizModel();
