import LessonCategoryModel from '../model/lessonCategory.model.js';
import { sendSuccess, sendCreated, sendBadRequest, sendNotFound, sendInternalError } from '../utils/response.js';

export const listCategories = async (req, res) => {
  try {
    const categories = await LessonCategoryModel.findAll();
    sendSuccess(res, categories, 'Categories retrieved successfully');
  } catch (err) {
    sendInternalError(res, 'Error retrieving categories', err);
  }
};

export const getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await LessonCategoryModel.findById(id);
    if (!category) {
      return sendNotFound(res, 'Category not found');
    }
    sendSuccess(res, category, 'Category retrieved successfully');
  } catch (err) {
    sendInternalError(res, 'Error retrieving category', err);
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, slug, icon } = req.body;
    if (!name || !slug) {
      return sendBadRequest(res, 'Name and slug are required');
    }

    const existing = await LessonCategoryModel.findOne({ slug });
    if (existing) {
      return sendBadRequest(res, 'Category with this slug already exists');
    }

    const category = await LessonCategoryModel.create({ name, slug, icon });
    sendCreated(res, category, 'Category created successfully');
  } catch (err) {
    sendInternalError(res, 'Error creating category', err);
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, icon } = req.body;

    const existing = await LessonCategoryModel.findById(id);
    if (!existing) {
      return sendNotFound(res, 'Category not found');
    }

    if (slug && slug !== existing.slug) {
      const duplicate = await LessonCategoryModel.findOne({ slug });
      if (duplicate) {
        return sendBadRequest(res, 'Category with this slug already exists');
      }
    }

    const updated = await LessonCategoryModel.update(id, { name, slug, icon });
    sendSuccess(res, updated, 'Category updated successfully');
  } catch (err) {
    sendInternalError(res, 'Error updating category', err);
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await LessonCategoryModel.findById(id);
    if (!existing) {
      return sendNotFound(res, 'Category not found');
    }

    await LessonCategoryModel.delete(id);
    sendSuccess(res, null, 'Category deleted successfully');
  } catch (err) {
    sendInternalError(res, 'Error deleting category', err);
  }
};
