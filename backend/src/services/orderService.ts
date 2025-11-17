import mongoose from 'mongoose';
import { Order, type IOrder, type OrderStatus } from '../models/Order.js';
import { OrderItem } from '../models/OrderItem.js';
import { OrderStatusHistory } from '../models/OrderStatusHistory.js';
import { Cart } from '../models/Cart.js';
import { CartItem } from '../models/CartItem.js';
import { Product } from '../models/Product.js';
import { AddOn } from '../models/AddOn.js';
import { AppError } from '../utils/AppError.js';
import PDFDocument from 'pdfkit';

interface OrderFilters {
  status?: OrderStatus;
  storeId?: string;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
}

interface OrderTracking {
  orderNumber: string;
  status: OrderStatus;
  statusHistory: Array<{
    status: OrderStatus;
    timestamp: Date;
    notes?: string;
  }>;
  estimatedReadyTime?: Date | undefined;
  actualReadyTime?: Date | undefined;
  pickedUpAt?: Date | undefined;
}

export class OrderService {
  /**
   * Get orders with filters based on user role
   */
  async getOrders(
    userId: string,
    role: string,
    filters?: OrderFilters
  ): Promise<IOrder[]> {
    const query: Record<string, unknown> = {};

    // Non-admin users can only see their own orders
    if (role !== 'admin') {
      query.userId = new mongoose.Types.ObjectId(userId);
    } else if (filters?.userId) {
      query.userId = new mongoose.Types.ObjectId(filters.userId);
    }

    // Apply filters
    if (filters?.status) {
      query.status = filters.status;
    }

    if (filters?.storeId) {
      query.storeId = new mongoose.Types.ObjectId(filters.storeId);
    }

    if (filters?.startDate || filters?.endDate) {
      query.createdAt = {} as Record<string, Date>;
      if (filters.startDate) {
        (query.createdAt as Record<string, Date>).$gte = filters.startDate;
      }
      if (filters.endDate) {
        (query.createdAt as Record<string, Date>).$lte = filters.endDate;
      }
    }

    const orders = await Order.find(query)
      .populate('storeId', 'name address city')
      .sort({ createdAt: -1 })
      .lean();

    return orders as unknown as IOrder[];
  }

  /**
   * Get order by ID with ownership validation
   */
  async getOrderById(
    orderId: string,
    userId: string,
    role: string
  ): Promise<IOrder> {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new AppError('Invalid order ID', 400);
    }

    const order = await Order.findById(orderId)
      .populate('storeId', 'name address city phone')
      .lean();

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    // Validate ownership for non-admin users
    if (role !== 'admin' && order.userId.toString() !== userId) {
      throw new AppError('You do not have permission to view this order', 403);
    }

    // Get order items
    const items = await OrderItem.find({ orderId: order._id }).lean();

    return { ...order, items } as unknown as IOrder;
  }

  /**
   * Get order tracking information
   */
  async getOrderTracking(
    orderId: string,
    userId: string
  ): Promise<OrderTracking> {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new AppError('Invalid order ID', 400);
    }

    const order = await Order.findById(orderId).lean();

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    // Validate ownership
    if (order.userId.toString() !== userId) {
      throw new AppError('You do not have permission to view this order', 403);
    }

    // Get status history
    const statusHistory = await OrderStatusHistory.find({ orderId: order._id })
      .sort({ createdAt: 1 })
      .lean();

    return {
      orderNumber: order.orderNumber,
      status: order.status,
      statusHistory: statusHistory.map((h) => ({
        status: h.status,
        timestamp: h.createdAt,
        ...(h.notes && { notes: h.notes }),
      })),
      estimatedReadyTime: order.estimatedReadyTime,
      actualReadyTime: order.actualReadyTime,
      pickedUpAt: order.pickedUpAt,
    };
  }

  /**
   * Generate PDF invoice for an order
   */
  async generateInvoice(
    orderId: string,
    userId: string,
    role: string
  ): Promise<Buffer> {
    const order = await this.getOrderById(orderId, userId, role);

    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Header
        doc.fontSize(20).text('INVOICE', { align: 'center' }).moveDown();

        // Order details
        doc
          .fontSize(12)
          .text(`Order Number: ${order.orderNumber}`)
          .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`)
          .text(`Status: ${order.status}`)
          .moveDown();

        // Store information
        if (order.storeId && typeof order.storeId === 'object') {
          const store = order.storeId as unknown as {
            name: string;
            address: string;
            city: string;
          };
          doc
            .fontSize(14)
            .text('Store Information', { underline: true })
            .fontSize(10)
            .text(store.name)
            .text(`${store.address}, ${store.city}`)
            .moveDown();
        }

        // Delivery address
        if (order.deliveryAddress) {
          doc
            .fontSize(14)
            .text('Delivery Address', { underline: true })
            .fontSize(10)
            .text(order.deliveryAddress)
            .moveDown();
        }

        // Items table
        doc.fontSize(14).text('Order Items', { underline: true }).moveDown(0.5);

        const items = (order as unknown as { items: unknown[] }).items || [];
        items.forEach((item: unknown) => {
          const orderItem = item as {
            productName: string;
            quantity: number;
            unitPrice: number;
            totalPrice: number;
          };
          doc
            .fontSize(10)
            .text(`${orderItem.productName} x ${orderItem.quantity}`, {
              continued: true,
            })
            .text(`$${orderItem.totalPrice.toFixed(2)}`, { align: 'right' });
        });

        doc.moveDown();

        // Totals
        doc
          .fontSize(10)
          .text(`Subtotal:`, { continued: true })
          .text(`$${order.subtotal.toFixed(2)}`, { align: 'right' });

        if (order.discount > 0) {
          doc
            .text(`Discount:`, { continued: true })
            .text(`-$${order.discount.toFixed(2)}`, { align: 'right' });
        }

        doc
          .text(`Tax:`, { continued: true })
          .text(`$${order.tax.toFixed(2)}`, { align: 'right' });

        if (order.deliveryFee > 0) {
          doc
            .text(`Delivery Fee:`, { continued: true })
            .text(`$${order.deliveryFee.toFixed(2)}`, { align: 'right' });
        }

        doc
          .fontSize(12)
          .text(`Total:`, { continued: true, underline: true })
          .text(`$${order.total.toFixed(2)}`, {
            align: 'right',
            underline: true,
          });

        doc.moveDown();

        // Payment information
        doc
          .fontSize(10)
          .text(`Payment Method: ${order.paymentMethod}`)
          .text(`Payment Status: ${order.paymentStatus}`);

        // Footer
        doc
          .moveDown(2)
          .fontSize(8)
          .text('Thank you for your order!', { align: 'center' });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Cancel an order within 5 minutes of placement
   */
  async cancelOrder(
    orderId: string,
    userId: string,
    reason: string
  ): Promise<IOrder> {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new AppError('Invalid order ID', 400);
    }

    const order = await Order.findById(orderId);

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    // Validate ownership
    if (order.userId.toString() !== userId) {
      throw new AppError(
        'You do not have permission to cancel this order',
        403
      );
    }

    // Check if order is already cancelled or completed
    if (order.status === 'cancelled') {
      throw new AppError('Order is already cancelled', 400);
    }

    if (order.status === 'completed') {
      throw new AppError('Cannot cancel a completed order', 400);
    }

    // Check 5-minute time limit
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    if (order.createdAt < fiveMinutesAgo) {
      throw new AppError(
        'Order can only be cancelled within 5 minutes of placement',
        400
      );
    }

    // Update order status
    order.status = 'cancelled';
    order.cancellationReason = reason;
    order.cancelledBy = 'customer';
    order.cancelledAt = new Date();

    // If payment was completed, initiate refund
    if (order.paymentStatus === 'completed') {
      order.refundAmount = order.total;
      order.refundStatus = 'pending';
    }

    await order.save();

    // Record status change
    await OrderStatusHistory.create({
      orderId: order._id,
      status: 'cancelled',
      notes: `Cancelled by customer: ${reason}`,
      changedBy: 'customer',
    });

    return order;
  }

  /**
   * Rate an order after delivery
   */
  async rateOrder(
    orderId: string,
    userId: string,
    rating: number,
    review?: string
  ): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new AppError('Invalid order ID', 400);
    }

    if (rating < 1 || rating > 5) {
      throw new AppError('Rating must be between 1 and 5', 400);
    }

    const order = await Order.findById(orderId);

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    // Validate ownership
    if (order.userId.toString() !== userId) {
      throw new AppError('You do not have permission to rate this order', 403);
    }

    // Check if order is completed
    if (order.status !== 'completed') {
      throw new AppError('Only completed orders can be rated', 400);
    }

    // Store rating and review (in a real app, this would be in a separate Rating model)
    // For now, we'll add it to the order notes
    const ratingNote = `Rating: ${rating}/5${review ? ` - Review: ${review}` : ''}`;
    order.notes = order.notes ? `${order.notes}\n${ratingNote}` : ratingNote;

    await order.save();
  }

  /**
   * Reorder - add all items from a previous order to cart
   */
  async reorder(orderId: string, userId: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new AppError('Invalid order ID', 400);
    }

    const order = await Order.findById(orderId);

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    // Validate ownership
    if (order.userId.toString() !== userId) {
      throw new AppError(
        'You do not have permission to reorder this order',
        403
      );
    }

    // Get order items
    const orderItems = await OrderItem.find({ orderId: order._id });

    if (orderItems.length === 0) {
      throw new AppError('No items found in this order', 400);
    }

    // Find or create active cart
    let cart = await Cart.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      status: 'active',
    });

    // If cart exists and is for a different store, clear it
    if (cart && cart.storeId.toString() !== order.storeId.toString()) {
      await CartItem.deleteMany({ cartId: cart._id });
      cart.storeId = order.storeId;
      cart.subtotal = 0;
      cart.total = 0;
    }

    // Create new cart if doesn't exist
    if (!cart) {
      cart = await Cart.create({
        userId: new mongoose.Types.ObjectId(userId),
        storeId: order.storeId,
        status: 'active',
      });
    }

    // Add items to cart
    for (const orderItem of orderItems) {
      // Verify product still exists and is available
      const product = await Product.findById(orderItem.productId);

      if (!product || !product.isAvailable) {
        continue; // Skip unavailable products
      }

      // Get current price
      const currentPrice = product.basePrice;

      // Calculate add-ons price
      let addOnsPrice = 0;
      const addOnIds: mongoose.Types.ObjectId[] = [];

      if (orderItem.addOns && orderItem.addOns.length > 0) {
        const addOnIdsFromSnapshot = orderItem.addOns
          .map((a) =>
            mongoose.Types.ObjectId.isValid(a.id)
              ? new mongoose.Types.ObjectId(a.id)
              : null
          )
          .filter((id): id is mongoose.Types.ObjectId => id !== null);

        const addOns = await AddOn.find({ _id: { $in: addOnIdsFromSnapshot } });
        addOnsPrice = addOns.reduce((sum, addOn) => sum + addOn.price, 0);
        addOnIds.push(...addOns.map((a) => a._id as mongoose.Types.ObjectId));
      }

      const unitPrice = currentPrice + addOnsPrice;
      const totalPrice = unitPrice * orderItem.quantity;

      // Create cart item
      await CartItem.create({
        cartId: cart._id,
        productId: orderItem.productId,
        quantity: orderItem.quantity,
        customization: orderItem.customization,
        addOns: addOnIds,
        notes: orderItem.notes,
        unitPrice,
        totalPrice,
      });
    }

    // Recalculate cart totals
    const cartItems = await CartItem.find({ cartId: cart._id });
    cart.subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    cart.tax = cart.subtotal * 0.1; // 10% tax
    cart.total = cart.subtotal + cart.tax + cart.deliveryFee - cart.discount;

    await cart.save();
  }

  /**
   * Validate order status transition
   */
  private isValidStatusTransition(
    currentStatus: OrderStatus,
    newStatus: OrderStatus
  ): boolean {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      pending_payment: ['confirmed', 'cancelled'],
      confirmed: ['preparing', 'cancelled'],
      preparing: ['ready', 'cancelled'],
      ready: ['picked_up', 'cancelled'],
      picked_up: ['completed'],
      completed: [],
      cancelled: [],
    };

    return validTransitions[currentStatus]?.includes(newStatus) || false;
  }
}
