import { describe, it, expect, beforeEach } from 'vitest';
import * as cartService from '../../../src/services/cartService.js';
import {
  createTestUser,
  createTestStore,
  createTestCategory,
  createTestProduct,
} from '../../utils/testHelpers.js';

describe('CartService', () => {
  let userId: string;
  let storeId: string;
  let productId: string;

  beforeEach(async () => {
    // Create test data
    const user = await createTestUser();
    const store = await createTestStore();
    const category = await createTestCategory();
    const product = await createTestProduct(category.id, { storeId: store.id });

    userId = user.id;
    storeId = store.id;
    productId = product.id;
  });

  describe('addItem', () => {
    it('should add item to cart', async () => {
      const cart = await cartService.addItem(userId, {
        productId,
        quantity: 2,
      });

      expect(cart).toBeDefined();
      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].productId.toString()).toBe(productId);
      expect(cart.items[0].quantity).toBe(2);
    });

    it('should update quantity if item already in cart', async () => {
      // Add item first time
      await cartService.addItem(userId, {
        productId,
        quantity: 2,
      });

      // Add same item again
      const cart = await cartService.addItem(userId, {
        productId,
        quantity: 3,
      });

      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].quantity).toBe(5); // 2 + 3
    });

    it('should calculate totals correctly', async () => {
      const cart = await cartService.addItem(userId, {
        productId,
        quantity: 2,
      });

      expect(cart.subtotal).toBe(20); // 2 * $10
      expect(cart.total).toBeGreaterThan(0);
    });

    it('should throw error if product not found', async () => {
      await expect(
        cartService.addItem(userId, {
          productId: '507f1f77bcf86cd799439011',
          quantity: 1,
        })
      ).rejects.toThrow('Product not found');
    });

    it('should throw error if product not available', async () => {
      const category = await createTestCategory();
      const unavailableProduct = await createTestProduct(category.id, {
        storeId,
        isAvailable: false,
      });

      await expect(
        cartService.addItem(userId, {
          productId: unavailableProduct.id,
          quantity: 1,
        })
      ).rejects.toThrow('Product is not available');
    });
  });

  describe('getCart', () => {
    it('should return empty cart for new user', async () => {
      const cart = await cartService.getCart(userId);

      expect(cart).toBeDefined();
      expect(cart.items).toHaveLength(0);
      expect(cart.subtotal).toBe(0);
      expect(cart.total).toBe(0);
    });

    it('should return cart with items', async () => {
      await cartService.addItem(userId, {
        productId,
        quantity: 2,
      });

      const cart = await cartService.getCart(userId);

      expect(cart.items).toHaveLength(1);
      expect(cart.subtotal).toBeGreaterThan(0);
    });
  });

  describe('updateItemQuantity', () => {
    it('should update item quantity', async () => {
      const cart = await cartService.addItem(userId, {
        productId,
        quantity: 2,
      });

      const itemId = cart.items[0].id;
      const updatedCart = await cartService.updateItemQuantity(
        userId,
        itemId,
        5
      );

      expect(updatedCart.items[0].quantity).toBe(5);
    });

    it('should throw error if item not found', async () => {
      await expect(
        cartService.updateItemQuantity(userId, '507f1f77bcf86cd799439011', 5)
      ).rejects.toThrow();
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', async () => {
      const cart = await cartService.addItem(userId, {
        productId,
        quantity: 2,
      });

      const itemId = cart.items[0].id;
      const updatedCart = await cartService.removeItem(userId, itemId);

      expect(updatedCart.items).toHaveLength(0);
    });
  });

  describe('clearCart', () => {
    it('should clear all items from cart', async () => {
      await cartService.addItem(userId, {
        productId,
        quantity: 2,
      });

      await cartService.clearCart(userId);

      const cart = await cartService.getCart(userId);
      expect(cart.items).toHaveLength(0);
    });
  });
});
