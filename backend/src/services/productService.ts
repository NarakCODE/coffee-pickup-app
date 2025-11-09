import mongoose from 'mongoose';
import { Product } from '../models/Product.js';
import { ProductCustomization } from '../models/ProductCustomization.js';
import { AddOn } from '../models/AddOn.js';
import { ProductAddOn } from '../models/ProductAddOn.js';
import { Category } from '../models/Category.js';
import { NotFoundError, BadRequestError } from '../utils/AppError.js';

interface ProductFilters {
  categoryId?: string;
  isFeatured?: boolean;
  isBestSelling?: boolean;
  tags?: string[];
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

/**
 * Get products with optional filtering
 * @param filters - Optional filters for products
 * @returns Array of products
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getProducts = async (filters?: ProductFilters): Promise<any[]> => {
  // Build query
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: any = {
    isAvailable: true,
    deletedAt: null,
  };

  // Category filter
  if (filters?.categoryId) {
    query.categoryId = filters.categoryId;
  }

  // Featured filter
  if (filters?.isFeatured !== undefined) {
    query.isFeatured = filters.isFeatured;
  }

  // Best selling filter
  if (filters?.isBestSelling !== undefined) {
    query.isBestSelling = filters.isBestSelling;
  }

  // Tags filter
  if (filters?.tags && filters.tags.length > 0) {
    query.tags = { $in: filters.tags };
  }

  // Price range filter
  if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
    query.basePrice = {};
    if (filters.minPrice !== undefined) {
      query.basePrice.$gte = filters.minPrice;
    }
    if (filters.maxPrice !== undefined) {
      query.basePrice.$lte = filters.maxPrice;
    }
  }

  // Search filter (name or description)
  if (filters?.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: 'i' } },
      { description: { $regex: filters.search, $options: 'i' } },
    ];
  }

  // Execute query with category population
  const products = await Product.find(query)
    .populate('categoryId', 'name slug imageUrl icon')
    .sort({ displayOrder: 1, name: 1 })
    .lean();

  return products.map((product) => ({
    ...product,
    id: product._id?.toString(),
    category: product.categoryId,
  }));
};

/**
 * Get product by ID with full details
 * @param productId - Product ID
 * @returns Product details with customizations and add-ons
 * @throws NotFoundError if product not found or unavailable
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getProductById = async (productId: string): Promise<any> => {
  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new BadRequestError('Invalid product ID');
  }

  const product = await Product.findOne({
    _id: productId,
    isAvailable: true,
    deletedAt: null,
  })
    .populate('categoryId', 'name slug imageUrl icon')
    .lean();

  if (!product) {
    throw new NotFoundError('Product not found');
  }

  // Get customizations
  const customizations = await ProductCustomization.find({
    productId: product._id,
  })
    .sort({ displayOrder: 1 })
    .lean();

  // Get add-ons
  const productAddOns = await ProductAddOn.find({
    productId: product._id,
  })
    .populate('addOnId')
    .lean();

  const addOns = productAddOns
    .map((pa) => {
      const addOn = pa.addOnId as unknown as {
        _id: mongoose.Types.ObjectId;
        name: string;
        description?: string;
        price: number;
        category: string;
        imageUrl?: string;
        isAvailable: boolean;
      };
      return {
        id: addOn._id?.toString(),
        name: addOn.name,
        description: addOn.description,
        price: addOn.price,
        category: addOn.category,
        imageUrl: addOn.imageUrl,
        isAvailable: addOn.isAvailable,
        isDefault: pa.isDefault,
      };
    })
    .filter((addOn) => addOn.isAvailable);

  return {
    ...product,
    id: product._id?.toString(),
    category: product.categoryId,
    customizations: customizations.map((c) => ({
      ...c,
      id: c._id?.toString(),
    })),
    addOns,
  };
};

/**
 * Get product by slug with full details
 * @param slug - Product slug
 * @returns Product details with customizations and add-ons
 * @throws NotFoundError if product not found or unavailable
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getProductBySlug = async (slug: string): Promise<any> => {
  const product = await Product.findOne({
    slug,
    isAvailable: true,
    deletedAt: null,
  })
    .populate('categoryId', 'name slug imageUrl icon')
    .lean();

  if (!product) {
    throw new NotFoundError('Product not found');
  }

  // Get customizations
  const customizations = await ProductCustomization.find({
    productId: product._id,
  })
    .sort({ displayOrder: 1 })
    .lean();

  // Get add-ons
  const productAddOns = await ProductAddOn.find({
    productId: product._id,
  })
    .populate('addOnId')
    .lean();

  const addOns = productAddOns
    .map((pa) => {
      const addOn = pa.addOnId as unknown as {
        _id: mongoose.Types.ObjectId;
        name: string;
        description?: string;
        price: number;
        category: string;
        imageUrl?: string;
        isAvailable: boolean;
      };
      return {
        id: addOn._id?.toString(),
        name: addOn.name,
        description: addOn.description,
        price: addOn.price,
        category: addOn.category,
        imageUrl: addOn.imageUrl,
        isAvailable: addOn.isAvailable,
        isDefault: pa.isDefault,
      };
    })
    .filter((addOn) => addOn.isAvailable);

  return {
    ...product,
    id: product._id?.toString(),
    category: product.categoryId,
    customizations: customizations.map((c) => ({
      ...c,
      id: c._id?.toString(),
    })),
    addOns,
  };
};

/**
 * Search products by query string
 * @param query - Search query
 * @param filters - Optional additional filters
 * @returns Array of matching products
 */
export const searchProducts = async (
  query: string,
  filters?: Omit<ProductFilters, 'search'>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any[]> => {
  return getProducts({
    ...filters,
    search: query,
  });
};

/**
 * Get products by store (menu for a specific store)
 * Note: StoreInventory model not yet implemented, so returning all available products
 * @param storeId - Store ID
 * @param filters - Optional filters
 * @returns Array of products available at the store
 */
export const getProductsByStore = async (
  storeId: string,
  filters?: ProductFilters
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any[]> => {
  // Validate store ID
  if (!mongoose.Types.ObjectId.isValid(storeId)) {
    throw new BadRequestError('Invalid store ID');
  }

  // TODO: When StoreInventory is implemented, filter by store availability
  // For now, return all available products
  return getProducts(filters);
};

/**
 * Get product customizations
 * @param productId - Product ID
 * @returns Array of customization options
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getProductCustomizations = async (
  productId: string
): Promise<any[]> => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new BadRequestError('Invalid product ID');
  }

  const customizations = await ProductCustomization.find({
    productId,
  })
    .sort({ displayOrder: 1 })
    .lean();

  return customizations.map((c) => ({
    ...c,
    id: c._id?.toString(),
  }));
};

/**
 * Get product add-ons
 * @param productId - Product ID
 * @returns Array of available add-ons
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getProductAddOns = async (productId: string): Promise<any[]> => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new BadRequestError('Invalid product ID');
  }

  const productAddOns = await ProductAddOn.find({
    productId,
  })
    .populate('addOnId')
    .lean();

  const addOns = productAddOns
    .map((pa) => {
      const addOn = pa.addOnId as unknown as {
        _id: mongoose.Types.ObjectId;
        name: string;
        description?: string;
        price: number;
        category: string;
        imageUrl?: string;
        isAvailable: boolean;
      };
      return {
        id: addOn._id?.toString(),
        name: addOn.name,
        description: addOn.description,
        price: addOn.price,
        category: addOn.category,
        imageUrl: addOn.imageUrl,
        isAvailable: addOn.isAvailable,
        isDefault: pa.isDefault,
      };
    })
    .filter((addOn) => addOn.isAvailable);

  return addOns;
};

/**
 * Calculate product price with customizations and add-ons
 * @param productId - Product ID
 * @param customizationSelections - Selected customization options
 * @param addOnIds - Selected add-on IDs
 * @returns Total price
 */
export const calculateProductPrice = async (
  productId: string,
  customizationSelections: { customizationType: string; optionId: string }[],
  addOnIds: string[]
): Promise<number> => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new BadRequestError('Invalid product ID');
  }

  // Get product
  const product = await Product.findById(productId);
  if (!product) {
    throw new NotFoundError('Product not found');
  }

  let totalPrice = product.basePrice;

  // Add customization price modifiers
  for (const selection of customizationSelections) {
    const customization = await ProductCustomization.findOne({
      productId,
      customizationType: selection.customizationType,
    });

    if (customization) {
      const option = customization.options.find(
        (opt) => opt.id === selection.optionId
      );
      if (option) {
        totalPrice += option.priceModifier;
      }
    }
  }

  // Add add-on prices
  for (const addOnId of addOnIds) {
    if (mongoose.Types.ObjectId.isValid(addOnId)) {
      const addOn = await AddOn.findById(addOnId);
      if (addOn && addOn.isAvailable) {
        totalPrice += addOn.price;
      }
    }
  }

  return totalPrice;
};

/**
 * Get products by category
 * @param categoryId - Category ID
 * @returns Array of products in the category
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getProductsByCategory = async (
  categoryId: string
): Promise<any[]> => {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new BadRequestError('Invalid category ID');
  }

  // Verify category exists
  const category = await Category.findOne({ _id: categoryId, isActive: true });
  if (!category) {
    throw new NotFoundError('Category not found');
  }

  return getProducts({ categoryId });
};
