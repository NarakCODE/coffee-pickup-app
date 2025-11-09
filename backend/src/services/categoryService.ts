import { Category } from '../models/Category.js';
import type { ICategory } from '../models/Category.js';
import { NotFoundError } from '../utils/AppError.js';

/**
 * Get all active categories ordered by displayOrder
 */
export const getAllCategories = async (): Promise<ICategory[]> => {
  const categories = await Category.find({ isActive: true }).sort({
    displayOrder: 1,
    name: 1,
  });

  return categories;
};

/**
 * Get category by ID
 */
export const getCategoryById = async (
  categoryId: string
): Promise<ICategory> => {
  const category = await Category.findOne({
    _id: categoryId,
    isActive: true,
  });

  if (!category) {
    throw new NotFoundError('Category not found');
  }

  return category;
};

/**
 * Get category by slug
 */
export const getCategoryBySlug = async (slug: string): Promise<ICategory> => {
  const category = await Category.findOne({
    slug,
    isActive: true,
  });

  if (!category) {
    throw new NotFoundError('Category not found');
  }

  return category;
};

/**
 * Get subcategories for a parent category
 */
export const getSubcategories = async (
  parentCategoryId: string
): Promise<ICategory[]> => {
  const subcategories = await Category.find({
    parentId: parentCategoryId,
    isActive: true,
  }).sort({
    displayOrder: 1,
    name: 1,
  });

  return subcategories;
};
