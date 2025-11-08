import type { Request, Response } from 'express';
import * as categoryService from '../services/categoryService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * @route   GET /api/categories
 * @desc    Get all active categories
 * @access  Public
 */
export const getAllCategories = asyncHandler(
  async (_req: Request, res: Response) => {
    const categories = await categoryService.getAllCategories();

    res.status(200).json({
      success: true,
      data: categories,
    });
  }
);

/**
 * @route   GET /api/categories/:id
 * @desc    Get category by ID
 * @access  Public
 */
export const getCategoryById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id!);

    res.status(200).json({
      success: true,
      data: category,
    });
  }
);

/**
 * @route   GET /api/categories/slug/:slug
 * @desc    Get category by slug
 * @access  Public
 */
export const getCategoryBySlug = asyncHandler(
  async (req: Request, res: Response) => {
    const { slug } = req.params;
    const category = await categoryService.getCategoryBySlug(slug!);

    res.status(200).json({
      success: true,
      data: category,
    });
  }
);

/**
 * @route   GET /api/categories/:id/subcategories
 * @desc    Get subcategories for a parent category
 * @access  Public
 */
export const getSubcategories = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const subcategories = await categoryService.getSubcategories(id!);

    res.status(200).json({
      success: true,
      data: subcategories,
    });
  }
);
