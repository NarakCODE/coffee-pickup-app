# Implementation Plan

- [ ] 1. Set up JWT authentication utilities and middleware
  - Create `src/utils/jwt.ts` with token generation and verification functions
  - Create `src/middlewares/auth.ts` middleware to protect routes
  - Add JWT_SECRET and JWT_EXPIRES_IN to environment configuration
  - _Requirements: 1.5, 1.6_

- [ ] 2. Enhance User model with authentication methods
  - Add bcrypt password hashing pre-save hook to User model
  - Add comparePassword method to User model
  - Add toJSON transform to exclude password from responses
  - Install bcrypt and jsonwebtoken packages
  - _Requirements: 1.1, 1.3, 10.2_

- [ ] 3. Implement authentication service and controller
  - Create `src/services/authService.ts` with register and login functions
  - Create `src/controllers/authController.ts` with register, login, and getMe endpoints
  - Create `src/routes/authRoutes.ts` with POST /register, POST /login, GET /me routes
  - Add auth routes to main router in `src/routes/index.ts`
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 4. Create Cafe model and validation
  - Create `src/models/Cafe.ts` with schema for cafe locations
  - Add isOpenNow method to check current operating status
  - Add getPickupTimes method to generate available time slots
  - Add validation for operating hours and coordinates
  - _Requirements: 2.1, 2.2, 2.4, 6.1_

- [ ] 5. Implement cafe service and controller
  - Create `src/services/cafeService.ts` with getAllCafes, getCafeById, and getAvailablePickupTimes functions
  - Create `src/controllers/cafeController.ts` with corresponding endpoint handlers
  - Create `src/routes/cafeRoutes.ts` with GET /cafes, GET /cafes/:id, GET /cafes/:id/pickup-times routes
  - Add cafe routes to main router
  - _Requirements: 2.1, 2.2, 2.3, 6.1, 6.5_

- [ ] 6. Create MenuItem model with customization options
  - Create `src/models/MenuItem.ts` with schema for menu items and customization options
  - Add validation for customization structure (single/multiple choice)
  - Add method to calculate item price with customizations
  - _Requirements: 3.1, 3.2, 3.3, 4.1, 4.2_

- [ ] 7. Implement menu service and controller
  - Create `src/services/menuService.ts` with getMenuByCafe, getMenuItemById, and calculateItemPrice functions
  - Create `src/controllers/menuController.ts` with corresponding endpoint handlers
  - Create `src/routes/menuRoutes.ts` with GET /cafes/:cafeId/menu and GET /menu/:id routes
  - Add menu routes to main router
  - _Requirements: 3.1, 3.2, 3.4, 3.5_

- [ ] 8. Create Cart model with item management
  - Create `src/models/Cart.ts` with schema for user carts and cart items
  - Add calculateTotal method to compute total price
  - Add validateSingleCafe method to ensure items from one cafe only
  - Add pre-save hook to calculate item totals and cart total
  - _Requirements: 5.1, 5.2, 5.6, 4.2_

- [ ] 9. Implement cart service with business logic
  - Create `src/services/cartService.ts` with getCart, addItemToCart, updateCartItem, removeCartItem, and clearCart functions
  - Implement validation to prevent mixing items from different cafes
  - Implement quantity validation (1-10 items)
  - Implement special instructions length validation (max 200 chars)
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 4.3, 4.4, 4.5_

- [ ] 10. Implement cart controller and routes
  - Create `src/controllers/cartController.ts` with handlers for all cart operations
  - Create `src/routes/cartRoutes.ts` with GET /cart, POST /cart/items, PATCH /cart/items/:id, DELETE /cart/items/:id, DELETE /cart routes
  - Apply auth middleware to all cart routes
  - Add cart routes to main router
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 11. Create Order model with order tracking
  - Create `src/models/Order.ts` with schema for orders and order items
  - Add indexes on userId, orderNumber, and status fields
  - Add method to generate unique order numbers (format: ORD-YYYYMMDD-XXX)
  - Add validation for order status transitions
  - _Requirements: 7.4, 7.7, 8.1, 8.3_

- [ ] 12. Implement order service with order placement logic
  - Create `src/services/orderService.ts` with createOrder, getOrderById, and getUserOrders functions
  - Implement order validation (non-empty cart, pickup time, cafe selection)
  - Implement pickup time validation (15 minutes in future, within operating hours)
  - Implement mock payment processing function
  - Implement cart clearing after successful order
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 6.2, 6.3, 6.4_

- [ ] 13. Implement order controller and routes
  - Create `src/controllers/orderController.ts` with handlers for order operations
  - Create `src/routes/orderRoutes.ts` with POST /orders, GET /orders, GET /orders/:id routes
  - Apply auth middleware to all order routes
  - Implement authorization check to ensure users only access their own orders
  - Add order routes to main router
  - _Requirements: 8.1, 8.2, 8.4, 8.5_

- [ ] 14. Implement request validation schemas
  - Create `src/utils/validators.ts` with validation schemas for all endpoints
  - Add validation schemas for auth (register, login)
  - Add validation schemas for cart operations (add item, update quantity)
  - Add validation schemas for order placement
  - Apply validation middleware to appropriate routes
  - _Requirements: 9.1, 9.5, 4.4_

- [ ] 15. Enhance error handling and responses
  - Update error handler to return consistent error response format
  - Add validation error formatting for detailed field-level errors
  - Ensure all error types (400, 401, 404, 500) return appropriate messages
  - Add authorization error handling for accessing other users' resources
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 8.4_

- [ ] 16. Add security enhancements
  - Configure rate limiting for auth endpoints (stricter limits)
  - Add input sanitization to prevent injection attacks
  - Ensure password is never included in API responses
  - Add request size limits to prevent large payload attacks
  - _Requirements: 10.2, 10.3, 10.4, 10.6_

- [ ] 17. Create database seed script for testing
  - Create `src/scripts/seed.ts` to populate test data
  - Add seed data for 2-3 cafe locations with operating hours
  - Add seed data for 10-15 menu items with various customization options
  - Add script command to package.json
  - _Requirements: 2.1, 3.1, 3.2_

- [ ] 18. Write unit tests for authentication
  - Write tests for JWT token generation and verification
  - Write tests for password hashing and comparison
  - Write tests for authService register and login functions
  - Write tests for auth middleware with valid/invalid tokens
  - _Requirements: 1.1, 1.3, 1.4, 1.5, 1.6_

- [ ] 19. Write unit tests for cart service
  - Write tests for adding items to cart
  - Write tests for updating cart item quantities
  - Write tests for removing items from cart
  - Write tests for cart total calculation
  - Write tests for single-cafe validation
  - Write tests for quantity and special instructions validation
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 4.3, 4.4, 4.5_

- [ ] 20. Write unit tests for order service
  - Write tests for order creation with valid data
  - Write tests for order validation (empty cart, missing pickup time)
  - Write tests for pickup time validation (past time, outside hours)
  - Write tests for order number generation uniqueness
  - Write tests for getUserOrders with filtering
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.7, 6.2, 6.3, 6.4_

- [ ] 21. Write integration tests for authentication flow
  - Write test for user registration endpoint
  - Write test for duplicate email registration
  - Write test for user login with valid credentials
  - Write test for login with invalid credentials
  - Write test for accessing protected route with valid token
  - Write test for accessing protected route without token
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [ ] 22. Write integration tests for order placement flow
  - Write test for complete order flow (add to cart, place order)
  - Write test for order placement with empty cart
  - Write test for order placement without pickup time
  - Write test for cart clearing after successful order
  - Write test for retrieving user's order history
  - Write test for accessing another user's order (should fail)
  - _Requirements: 7.1, 7.2, 7.3, 7.6, 8.1, 8.2, 8.4_

- [ ] 23. Add API documentation comments
  - Add JSDoc comments to all controller methods
  - Document request/response formats for each endpoint
  - Document authentication requirements
  - Document error responses
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [ ] 24. Create health check and status endpoint
  - Add GET /health endpoint to check API status
  - Add database connection check
  - Return API version and environment info
  - _Requirements: 10.1_
