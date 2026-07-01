import db from '../config/db.js';

const HistoryModel = {
  async create({ userId, mode, prediction, confidenceRating, resolutionStatus }) {
    const [newLog] = await db('translation_logs')
      .insert({
        user_id: userId,
        mode,
        prediction,
        confidence_rating: confidenceRating,
        resolution_status: resolutionStatus,
      })
      .returning('*');
    
    return newLog;
  },

  async findByUserId(userId, limit = 20, offset = 0) {
    return db('translation_logs')
      .where({ user_id: userId })
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);
  },

  async findAll(limit = 50, offset = 0) {
    return db('translation_logs')
      .join('users', 'translation_logs.user_id', 'users.id')
      .select(
        'translation_logs.*',
        'users.email',
        'users.first_name',
        'users.last_name'
      )
      .orderBy('translation_logs.created_at', 'desc')
      .limit(limit)
      .offset(offset);
  }
};

export default HistoryModel;
