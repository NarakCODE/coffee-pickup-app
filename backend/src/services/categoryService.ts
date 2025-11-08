import Category from '../models/Category.js';
import type { ICategory } from '../models/Category.js';
import { NotFoundError } from '../utils/AppError.js';
import mongoose from 'mongoose';

/**
 * Get all active categories ordered by display order
 */
export const getAllCategories = async (): Promise<ICategory[]> => {
  const categories = await Category.find({ isActive: true })
    .sort({ displayOrder: 1, name: 1 })
    .lean();

  return categories as unknown as ICategory[];
};

/**
 * Get category by ID
 */
export const getCategoryById = async (
  categoryId: string
): Promise<ICategory> => {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new NotFoundError('Category not found');
  }

  const category = await Category.findOne({
    _id: categoryId,
    isActive: true,
  }).lean();

  if (!category) {
    throw new NotFoundError('Category not found');
  }

  return category as unknown as ICategory;
};

/**
 * Get category by slug
 */
export const getCategoryBySlug = async (slug: string): Promise<ICategory> => {
  const category = await Category.findOne({
    slug: slug.toLowerCase(),
    isActive: true,
  }).lean();

  if (!category) {
    throw new NotFoundError('Category not found');
  }

  return category as unknown as ICategory;
};

/**
 * Get subcategories for a parent category
 */
export const getSubcategories = async (
  parentCategoryId: string
): Promise<ICategory[]> => {
  if (!mongoose.Types.ObjectId.isValid(parentCategoryId)) {
    throw new NotFoundError('Parent category not found');
  }

  // Verify parent category exists
  const parentCategory = await Category.findOne({
    _id: parentCategoryId,
    isActive: true,
  });

  if (!parentCategory) {
    throw new NotFoundError('Parent category not found');
  }

  const subcategories = await Category.find({
    parentCategoryId: parentCategoryId,
    isActive: true,
  })
    .sort({ displayOrder: 1, name: 1 })
    .lean();

  return subcategories as unknown as ICategory[];
};
