import LessonModel from '../model/lesson.model.js';
import { sendSuccess, sendCreated, sendBadRequest, sendNotFound, sendInternalError } from '../utils/response.js';

export const listLessons = async (req, res) => {
  try {
    const { categoryId } = req.query;
    let lessons;
    if (categoryId) {
      lessons = await LessonModel.findByCategoryId(categoryId);
    } else {
      lessons = await LessonModel.findAll();
    }
    sendSuccess(res, lessons, 'Lessons retrieved successfully');
  } catch (err) {
    sendInternalError(res, 'Error retrieving lessons', err);
  }
};

export const getLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const lesson = await LessonModel.findById(id);
    if (!lesson) {
      return sendNotFound(res, 'Lesson not found');
    }
    sendSuccess(res, lesson, 'Lesson retrieved successfully');
  } catch (err) {
    sendInternalError(res, 'Error retrieving lesson', err);
  }
};

export const createLesson = async (req, res) => {
  try {
    const { title, categoryId, type, slug, description, instructions } = req.body;
    let lessonUrl = req.body.lessonUrl;

    if (req.file) {
      const baseUrl = process.env.API_BASE_URL || `${req.protocol}://${req.get('host')}`;
      lessonUrl = `${baseUrl}/uploads/${req.file.filename}`;
    }

    if (!title || !categoryId || !type || !slug) {
      return sendBadRequest(res, 'Title, categoryId, type, and slug are required');
    }

    const existing = await LessonModel.findOne({ slug });
    if (existing) {
      return sendBadRequest(res, 'Lesson with this slug already exists');
    }

    const lesson = await LessonModel.create({
      title,
      categoryId,
      type,
      slug,
      lessonUrl,
      description,
      instructions,
    });
    sendCreated(res, lesson, 'Lesson created successfully');
  } catch (err) {
    sendInternalError(res, 'Error creating lesson', err);
  }
};

export const updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, categoryId, type, slug, description, instructions } = req.body;
    let lessonUrl = req.body.lessonUrl;

    if (req.file) {
      const baseUrl = process.env.API_BASE_URL || `${req.protocol}://${req.get('host')}`;
      lessonUrl = `${baseUrl}/uploads/${req.file.filename}`;
    }

    const existing = await LessonModel.findById(id);
    if (!existing) {
      return sendNotFound(res, 'Lesson not found');
    }

    if (slug && slug !== existing.slug) {
      const duplicate = await LessonModel.findOne({ slug });
      if (duplicate) {
        return sendBadRequest(res, 'Lesson with this slug already exists');
      }
    }

    const updated = await LessonModel.update(id, {
      title,
      categoryId,
      type,
      slug,
      lessonUrl: lessonUrl || existing.lessonUrl,
      description,
      instructions,
    });
    sendSuccess(res, updated, 'Lesson updated successfully');
  } catch (err) {
    sendInternalError(res, 'Error updating lesson', err);
  }
};

export const deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await LessonModel.findById(id);
    if (!existing) {
      return sendNotFound(res, 'Lesson not found');
    }

    await LessonModel.delete(id);
    sendSuccess(res, null, 'Lesson deleted successfully');
  } catch (err) {
    sendInternalError(res, 'Error deleting lesson', err);
  }
};
