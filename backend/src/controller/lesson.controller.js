import LessonModel from '../model/lesson.model.js';
import { sendSuccess, sendCreated, sendBadRequest, sendNotFound, sendInternalError } from '../utils/response.js';
import { uploadToCloudinary } from '../services/cloudinary.service.js';

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
    let { title, categoryId, type, slug, lessonUrl, description, instructions } = req.body;

    let finalCategoryId = categoryId;
    if (typeof categoryId === 'string') {
      finalCategoryId = parseInt(categoryId, 10);
    }

    if (!title || !finalCategoryId || !type || !slug) {
      return sendBadRequest(res, 'Title, categoryId, type, and slug are required');
    }

    const existing = await LessonModel.findOne({ slug });
    if (existing) {
      return sendBadRequest(res, 'Lesson with this slug already exists');
    }

    let finalLessonUrl = lessonUrl;
    const isUrlLink = typeof lessonUrl === 'string' && (lessonUrl.startsWith('http://') || lessonUrl.startsWith('https://'));
    
    if (!isUrlLink && req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer);
      finalLessonUrl = uploadResult.secure_url;
    }

    let instructionsData = instructions;
    if (typeof instructions === 'string') {
      try {
        instructionsData = JSON.parse(instructions);
      } catch (err) {
        // Fallback
      }
    }

    const lesson = await LessonModel.create({
      title,
      categoryId: finalCategoryId,
      type,
      slug,
      lessonUrl: finalLessonUrl,
      description,
      instructions: instructionsData,
    });
    sendCreated(res, lesson, 'Lesson created successfully');
  } catch (err) {
    sendInternalError(res, 'Error creating lesson', err);
  }
};

export const updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    let { title, categoryId, type, slug, lessonUrl, description, instructions } = req.body;

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

    let finalCategoryId = categoryId;
    if (categoryId !== undefined) {
      if (typeof categoryId === 'string') {
        finalCategoryId = parseInt(categoryId, 10);
      }
    }

    let finalLessonUrl = lessonUrl;
    const isUrlLink = typeof lessonUrl === 'string' && (lessonUrl.startsWith('http://') || lessonUrl.startsWith('https://'));
    
    if (!isUrlLink && req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer);
      finalLessonUrl = uploadResult.secure_url;
    }

    let instructionsData = instructions;
    if (instructions !== undefined) {
      if (typeof instructions === 'string') {
        try {
          instructionsData = JSON.parse(instructions);
        } catch (err) {
          // Fallback
        }
      }
    }

    const updated = await LessonModel.update(id, {
      title,
      categoryId: finalCategoryId,
      type,
      slug,
      lessonUrl: finalLessonUrl,
      description,
      instructions: instructionsData,
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
