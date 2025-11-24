import { describe, it, expect, beforeEach } from 'vitest';
import * as productService from '../../../src/services/productService.js';
import {
  createTestStore,
  createTestCategory,
  createTestProduct,
} from '../../utils/testHelpers.js';

describe('ProductService', () => {
  let storeId: string;
  let categoryId: string;

  beforeEach(async () => {
    const store = await createTestStore();
    const category = await createTestCategory();
    storeId = store.id;
    categoryId = category.id;
  });

  describe('getProducts', () => {
    beforeEach(async () => {
      await createTestProduct(categoryId, { name: 'Product 1', storeId });
      await createTestProduct(categoryId, { name: 'Product 2', storeId });
      await createTestProduct(categoryId, {
        name: 'Product 3',
        storeId,
        isAvailable: false,
      });
    });

    it('should return all products', async () => {
      const result = await productService.getProducts({});

      expect(result.data.length).toBeGreaterThanOrEqual(2);
    });

    it('should filter by availability', async () => {
      const result = await productService.getProducts({ isAvailable: true });

      expect(result.data.every((p) => p.isAvailable === true)).toBe(true);
    });

    it('should filter by category', async () => {
      const result = await productService.getProducts({ categoryId });

      expect(
        result.data.every((p) => p.categoryId.toString() === categoryId)
      ).toBe(true);
    });

    it('should support pagination', async () => {
      const result = await productService.getProducts(
        {},
        { page: 1, limit: 2 }
      );

      expect(result.data.length).toBeLessThanOrEqual(2);
      expect(result.pagination).toBeDefined();
    });
  });

  describe('getProductById', () => {
    it('should return product by id', async () => {
      const product = await createTestProduct(categoryId, { storeId });

      const found = await productService.getProductById(product.id);

      expect(found).toBeDefined();
      expect(found.name).toBe(product.name);
    });

    it('should throw error for non-existent product', async () => {
      await expect(
        productService.getProductById('507f1f77bcf86cd799439011')
      ).rejects.toThrow('Product not found');
    });
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const productData = {
        name: 'New Product',
        description: 'Test description',
        categoryId,
        storeId,
        basePrice: 15.99,
        currency: 'USD',
        preparationTime: 10,
      };

      const product = await productService.createProduct(productData);

      expect(product).toBeDefined();
      expect(product.name).toBe('New Product');
      expect(product.basePrice).toBe(15.99);
    });

    it('should generate slug from name', async () => {
      const productData = {
        name: 'Test Product Name',
        description: 'Test description',
        categoryId,
        storeId,
        basePrice: 10.0,
        currency: 'USD',
        preparationTime: 10,
      };

      const product = await productService.createProduct(productData);

      expect(product.slug).toBe('test-product-name');
    });
  });

  describe('updateProduct', () => {
    it('should update product', async () => {
      const product = await createTestProduct(categoryId, { storeId });

      const updated = await productService.updateProduct(product.id, {
        name: 'Updated Product',
        basePrice: 20.0,
      });

      expect(updated.name).toBe('Updated Product');
      expect(updated.basePrice).toBe(20.0);
    });
  });

  describe('deleteProduct', () => {
    it('should soft delete product', async () => {
      const product = await createTestProduct(categoryId, { storeId });

      await productService.deleteProduct(product.id);

      await expect(productService.getProductById(product.id)).rejects.toThrow(
        'Product not found'
      );
    });
  });

  describe('updateProductStatus', () => {
    it('should update product availability', async () => {
      const product = await createTestProduct(categoryId, {
        storeId,
        isAvailable: true,
      });

      const updated = await productService.updateProductStatus(
        product.id,
        false
      );

      expect(updated.isAvailable).toBe(false);
    });
  });

  describe('duplicateProduct', () => {
    it('should duplicate product with "Copy" suffix', async () => {
      const original = await createTestProduct(categoryId, {
        name: 'Original Product',
        storeId,
      });

      const duplicate = await productService.duplicateProduct(original.id);

      expect(duplicate.name).toBe('Original Product - Copy');
      expect(duplicate.id).not.toBe(original.id);
      expect(duplicate.basePrice).toBe(original.basePrice);
    });
  });
});
