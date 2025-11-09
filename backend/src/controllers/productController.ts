import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as productService from '../services/productService.js';
import { BadRequestError } from '../utils/AppError.js';

/**
 * Get all products with optional filtering
 * GET /api/products
 * Query params: categoryId, isFeatured, isBestSelling, tags, minPrice, maxPrice, search
 */
export const getProducts = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const {
      categoryId,
      isFeatured,
      isBestSelling,
      tags,
      minPrice,
      maxPrice,
      search,
    } = req.query;

    // Build filters
    const filters: {
      categoryId?: string;
      isFeatured?: boolean;
      isBestSelling?: boolean;
      tags?: string[];
      minPrice?: number;
      maxPrice?: number;
      search?: string;
    } = {};

    if (categoryId) {
      filters.categoryId = categoryId as string;
    }

    if (isFeatured !== undefined) {
      filters.isFeatured = isFeatured === 'true';
    }

    if (isBestSelling !== undefined) {
      filters.isBestSelling = isBestSelling === 'true';
    }

    if (tags) {
      filters.tags = Array.isArray(tags)
        ? (tags as string[])
        : [tags as string];
    }

    if (minPrice) {
      const min = parseFloat(minPrice as string);
      if (isNaN(min) || min < 0) {
        throw new BadRequestError('minPrice must be a non-negative number');
      }
      filters.minPrice = min;
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice as string);
      if (isNaN(max) || max < 0) {
        throw new BadRequestError('maxPrice must be a non-negative number');
      }
      filters.maxPrice = max;
    }

    if (search) {
      filters.search = search as string;
    }

    const products = await productService.getProducts(filters);

    res.status(200).json({
      success: true,
      data: {
        products,
        count: products.length,
      },
    });
  }
);

/**
 * Get product by ID
 * GET /api/products/:id
 */
export const getProductById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id) {
      throw new BadRequestError('Product ID is required');
    }

    const product = await productService.getProductById(id);

    res.status(200).json({
      success: true,
      data: product,
    });
  }
);

/**
 * Get product by slug
 * GET /api/products/slug/:slug
 */
export const getProductBySlug = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params;

    if (!slug) {
      throw new BadRequestError('Product slug is required');
    }

    const product = await productService.getProductBySlug(slug);

    res.status(200).json({
      success: true,
      data: product,
    });
  }
);

/**
 * Search products
 * GET /api/products/search
 * Query params: q (query), categoryId, isFeatured, isBestSelling, tags, minPrice, maxPrice
 */
export const searchProducts = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const {
      q,
      categoryId,
      isFeatured,
      isBestSelling,
      tags,
      minPrice,
      maxPrice,
    } = req.query;

    if (!q) {
      throw new BadRequestError('Search query (q) is required');
    }

    // Build filters
    const filters: {
      categoryId?: string;
      isFeatured?: boolean;
      isBestSelling?: boolean;
      tags?: string[];
      minPrice?: number;
      maxPrice?: number;
    } = {};

    if (categoryId) {
      filters.categoryId = categoryId as string;
    }

    if (isFeatured !== undefined) {
      filters.isFeatured = isFeatured === 'true';
    }

    if (isBestSelling !== undefined) {
      filters.isBestSelling = isBestSelling === 'true';
    }

    if (tags) {
      filters.tags = Array.isArray(tags)
        ? (tags as string[])
        : [tags as string];
    }

    if (minPrice) {
      const min = parseFloat(minPrice as string);
      if (isNaN(min) || min < 0) {
        throw new BadRequestError('minPrice must be a non-negative number');
      }
      filters.minPrice = min;
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice as string);
      if (isNaN(max) || max < 0) {
        throw new BadRequestError('maxPrice must be a non-negative number');
      }
      filters.maxPrice = max;
    }

    const products = await productService.searchProducts(q as string, filters);

    res.status(200).json({
      success: true,
      data: {
        query: q,
        products,
        count: products.length,
      },
    });
  }
);

/**
 * Get products by store (store menu)
 * GET /api/stores/:storeId/menu
 * Query params: categoryId, isFeatured, isBestSelling, tags, minPrice, maxPrice
 */
export const getStoreMenu = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { storeId } = req.params;
    const { categoryId, isFeatured, isBestSelling, tags, minPrice, maxPrice } =
      req.query;

    if (!storeId) {
      throw new BadRequestError('Store ID is required');
    }

    // Build filters
    const filters: {
      categoryId?: string;
      isFeatured?: boolean;
      isBestSelling?: boolean;
      tags?: string[];
      minPrice?: number;
      maxPrice?: number;
    } = {};

    if (categoryId) {
      filters.categoryId = categoryId as string;
    }

    if (isFeatured !== undefined) {
      filters.isFeatured = isFeatured === 'true';
    }

    if (isBestSelling !== undefined) {
      filters.isBestSelling = isBestSelling === 'true';
    }

    if (tags) {
      filters.tags = Array.isArray(tags)
        ? (tags as string[])
        : [tags as string];
    }

    if (minPrice) {
      const min = parseFloat(minPrice as string);
      if (isNaN(min) || min < 0) {
        throw new BadRequestError('minPrice must be a non-negative number');
      }
      filters.minPrice = min;
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice as string);
      if (isNaN(max) || max < 0) {
        throw new BadRequestError('maxPrice must be a non-negative number');
      }
      filters.maxPrice = max;
    }

    const products = await productService.getProductsByStore(storeId, filters);

    res.status(200).json({
      success: true,
      data: {
        storeId,
        products,
        count: products.length,
      },
    });
  }
);

/**
 * Get product customizations
 * GET /api/products/:id/customizations
 */
export const getProductCustomizations = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id) {
      throw new BadRequestError('Product ID is required');
    }

    const customizations = await productService.getProductCustomizations(id);

    res.status(200).json({
      success: true,
      data: {
        productId: id,
        customizations,
      },
    });
  }
);

/**
 * Get product add-ons
 * GET /api/products/:id/addons
 */
export const getProductAddOns = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id) {
      throw new BadRequestError('Product ID is required');
    }

    const addOns = await productService.getProductAddOns(id);

    res.status(200).json({
      success: true,
      data: {
        productId: id,
        addOns,
      },
    });
  }
);

/**
 * Get products by category
 * GET /api/categories/:categoryId/products
 */
export const getProductsByCategory = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { categoryId } = req.params;

    if (!categoryId) {
      throw new BadRequestError('Category ID is required');
    }

    const products = await productService.getProductsByCategory(categoryId);

    res.status(200).json({
      success: true,
      data: {
        categoryId,
        products,
        count: products.length,
      },
    });
  }
);
