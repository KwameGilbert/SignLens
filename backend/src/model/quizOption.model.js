import BaseModel from './base.model.js';

class QuizOptionModel extends BaseModel {
  constructor() {
    super('quizOptions', [
      'id',
      'quizId',
      'name',
      'isCorrect',
      'orderIndex',
      'createdAt',
      'updatedAt',
    ]);
  }

  async findByQuizId(quizId) {
    return this.find({ quizId }, { orderBy: 'orderIndex', orderDir: 'asc' });
  }
}

export default new QuizOptionModel();
