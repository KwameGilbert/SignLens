import QuizModel from '../model/quiz.model.js';
import QuizOptionModel from '../model/quizOption.model.js';
import { sendSuccess, sendCreated, sendBadRequest, sendNotFound, sendInternalError } from '../utils/response.js';

export const listQuizzes = async (req, res) => {
  try {
    const { lessonId } = req.query;
    let quizzes;
    if (lessonId) {
      quizzes = await QuizModel.findByLessonId(lessonId);
    } else {
      quizzes = await QuizModel.findAll();
    }
    
    // Populate options for each quiz in the list
    for (const quiz of quizzes) {
      quiz.options = await QuizOptionModel.findByQuizId(quiz.id);
    }

    sendSuccess(res, quizzes, 'Quizzes retrieved successfully');
  } catch (err) {
    sendInternalError(res, 'Error retrieving quizzes', err);
  }
};

export const getQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await QuizModel.findById(id);
    if (!quiz) {
      return sendNotFound(res, 'Quiz not found');
    }
    
    const options = await QuizOptionModel.findByQuizId(id);
    quiz.options = options;
    
    sendSuccess(res, quiz, 'Quiz retrieved successfully');
  } catch (err) {
    sendInternalError(res, 'Error retrieving quiz', err);
  }
};

export const createQuiz = async (req, res) => {
  try {
    const { categoryId, lessonId, question, options } = req.body;
    if (!lessonId || !question) {
      return sendBadRequest(res, 'LessonId and question are required');
    }

    const quiz = await QuizModel.create({ categoryId, lessonId, question });

    // Handle creating options if they are passed in body
    if (options && Array.isArray(options)) {
      quiz.options = [];
      for (const opt of options) {
        if (opt.name) {
          const createdOpt = await QuizOptionModel.create({
            quizId: quiz.id,
            name: opt.name,
            isCorrect: !!opt.isCorrect,
            orderIndex: opt.orderIndex || 0,
          });
          quiz.options.push(createdOpt);
        }
      }
    }

    sendCreated(res, quiz, 'Quiz created successfully');
  } catch (err) {
    sendInternalError(res, 'Error creating quiz', err);
  }
};

export const updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryId, lessonId, question } = req.body;

    const existing = await QuizModel.findById(id);
    if (!existing) {
      return sendNotFound(res, 'Quiz not found');
    }

    const updated = await QuizModel.update(id, { categoryId, lessonId, question });
    sendSuccess(res, updated, 'Quiz updated successfully');
  } catch (err) {
    sendInternalError(res, 'Error updating quiz', err);
  }
};

export const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await QuizModel.findById(id);
    if (!existing) {
      return sendNotFound(res, 'Quiz not found');
    }

    await QuizModel.delete(id);
    sendSuccess(res, null, 'Quiz deleted successfully');
  } catch (err) {
    sendInternalError(res, 'Error deleting quiz', err);
  }
};

// --- Quiz Options Management Actions ---

export const listOptions = async (req, res) => {
  try {
    const { quizId } = req.params;
    const options = await QuizOptionModel.findByQuizId(quizId);
    sendSuccess(res, options, 'Quiz options retrieved successfully');
  } catch (err) {
    sendInternalError(res, 'Error retrieving options', err);
  }
};

export const createOption = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { name, isCorrect, orderIndex } = req.body;

    if (!name) {
      return sendBadRequest(res, 'Option name is required');
    }

    const option = await QuizOptionModel.create({
      quizId: parseInt(quizId, 10),
      name,
      isCorrect: !!isCorrect,
      orderIndex: orderIndex || 0,
    });
    sendCreated(res, option, 'Quiz option created successfully');
  } catch (err) {
    sendInternalError(res, 'Error creating option', err);
  }
};

export const deleteOption = async (req, res) => {
  try {
    const { id } = req.params; // option ID
    const existing = await QuizOptionModel.findById(id);
    if (!existing) {
      return sendNotFound(res, 'Quiz option not found');
    }

    await QuizOptionModel.delete(id);
    sendSuccess(res, null, 'Quiz option deleted successfully');
  } catch (err) {
    sendInternalError(res, 'Error deleting quiz option', err);
  }
};
