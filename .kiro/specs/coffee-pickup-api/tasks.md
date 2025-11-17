# Implementation Plan

## Phase 1: Core Authentication & User Management

- [x] 1. Set up JWT authentication utilities and middleware

  - Create `src/utils/jwt.ts` with token generation and verification functions
  - Create `src/middlewares/auth.ts` middleware to protect routes
  - Add JWT_SECRET and JWT_EXPIRES_IN to environment configuration
  - _Requirements: 1.5, 1.6, 1.7_

- [x] 2. Enhance User model with authentication and loyalty features

  - Add bcrypt password hashing pre-save hook to User model
  - Add comparePassword method to User model
  - Add loyalty points and tier fields
  - Add referral code generation
  - Add toJSON transform to exclude password from responses
  - _Requirements: 1.1, 1.3, 14.3, 14.4_

- [x] 3. Implement authentication service and controller

  - Create `src/services/authService.ts` with register and login functions
  - Create `src/controllers/authController.ts` with register, login, and getMe endpoints
  - Create `src/routes/authRoutes.ts` with POST /register, POST /login, GET /me routes
  - Add auth routes to main router in `src/routes/index.ts`
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 4. Create Store model and validation

  - Create `src/models/Store.ts` with schema for store locations
  - Add isOpenNow method to check current operating status
  - Add getPickupTimes method to generate available time slots
  - Add validation for operating hours and coordinates
  - _Requirements: 4.1, 4.2, 4.5, 10.1_

- [x] 5. Implement OTP verification system

  - Create `src/models/Otp.ts` for OTP storage
  - Create `src/services/otpService.ts` for OTP generation and verification
  - Integrate email service (Brevo) for sending OTPs
  - Add OTP verification endpoints to auth controller
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [x] 6. Implement refresh token system

  - Create `src/models/RefreshToken.ts` for token management
  - Add refresh token generation to auth service
  - Add refresh token endpoint
  - Add logout endpoint with token revocation
  - _Requirements: 1.9, 1.10_

- [x] 7. Implement user profile management

  - Create `src/services/userService.ts` for profile operations
  - Create `src/controllers/userController.ts` for profile endpoints
  - Add profile update, password change, and settings endpoints
  - Add profile image upload functionality
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

## Phase 2: Store & Product Management

- [x] 8. Implement store service and controller

  - Create `src/services/storeService.ts` with getAllStores, getStoreById functions
  - Add distance calculation for location-based filtering
  - Create `src/controllers/storeController.ts` with corresponding endpoint handlers
  - Create `src/routes/storeRoutes.ts` with GET /stores, GET /stores/:id routes
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [x] 9. Create Category model and endpoints

  - Create `src/models/Category.ts` with hierarchical structure support
  - Create `src/services/categoryService.ts` for category operations
  - Create `src/controllers/categoryController.ts` and routes
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 10. Create Product model with customization support

  - Create `src/models/Product.ts` with schema for menu items
  - Create `src/models/ProductCustomization.ts` for customization options
  - Add validation for customization structure
  - Add method to calculate item price with customizations
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [x] 11. Create Add-on models

  - Create `src/models/AddOn.ts` for add-on items
  - Create `src/models/ProductAddOn.ts` for product-addon relationships
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 12. Implement product service and controller

  - Create `src/services/productService.ts` with product operations
  - Add product search and filtering functionality
  - Create `src/controllers/productController.ts` with endpoints
  - Create `src/routes/productRoutes.ts`
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

- [ ] 13. Implement store inventory management
  - Create `src/models/StoreInventory.ts` for product availability per store
  - Add inventory checking to product service
  - _Requirements: 6.5, 24.1, 24.2, 24.3, 24.4, 24.5_

## Phase 3: Shopping Cart & Orders

- [ ] 14. Create Cart models

  - Create `src/models/Cart.ts` with schema for user carts
  - Create `src/models/CartItem.ts` for cart items
  - Add calculateTotal method to compute total price
  - Add validateSingleStore method
  - _Requirements: 9.1, 9.2, 9.6, 9.10_

- [ ] 15. Implement cart service with business logic

  - Create `src/services/cartService.ts` with cart operations
  - Implement validation to prevent mixing items from different stores
  - Implement quantity and special instructions validation
  - Add promo code application logic
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9, 9.10_

- [ ] 16. Implement cart controller and routes

  - Create `src/controllers/cartController.ts` with handlers
  - Create `src/routes/cartRoutes.ts` with all cart endpoints
  - Apply auth middleware to all cart routes
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.7, 9.8_

- [ ] 17. Create Order models

  - Create `src/models/Order.ts` with schema for orders
  - Create `src/models/OrderItem.ts` for order items
  - Create `src/models/OrderStatusHistory.ts` for status tracking
  - Add method to generate unique order numbers
  - _Requirements: 11.7, 12.1, 12.2, 12.3, 12.4, 12.7_

- [ ] 18. Implement order service with placement logic

  - Create `src/services/orderService.ts` with order operations
  - Implement order validation (cart, pickup time, store)
  - Implement pickup time validation
  - Implement cart clearing after successful order
  - Add order status management
  - _Requirements: 11.1, 11.2, 11.3, 11.8, 11.12, 11.13, 11.14, 12.8, 12.9, 12.10_

- [ ] 19. Implement payment service

  - Create `src/services/paymentService.ts` for payment processing
  - Integrate payment providers (ABA, ACLEDA, Wing)
  - Add payment confirmation webhook handling
  - _Requirements: 11.4, 11.5, 11.6_

- [ ] 20. Implement order controller and routes
  - Create `src/controllers/orderController.ts` with handlers
  - Create `src/routes/orderRoutes.ts` with order endpoints
  - Apply auth middleware and authorization checks
  - _Requirements: 11.1, 11.2, 11.3, 12.1, 12.2, 12.5, 12.6, 12.8_

## Phase 4: Promo Codes & Loyalty System

- [ ] 21. Create Promo Code models

  - Create `src/models/PromoCode.ts` for promo codes
  - Create `src/models/PromoCodeUsage.ts` for usage tracking
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.9_

- [ ] 22. Implement promo code service

  - Create `src/services/promoService.ts` for promo validation
  - Add promo code validation logic with all rules
  - Add discount calculation
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8, 13.9, 13.10_

- [ ] 23. Implement promo code controller and routes

  - Create `src/controllers/promoController.ts`
  - Create `src/routes/promoRoutes.ts`
  - Add endpoints for viewing and validating promo codes
  - _Requirements: 13.10_

- [ ] 24. Create Loyalty models

  - Create `src/models/LoyaltyPointTransaction.ts` for point history
  - Create `src/models/Reward.ts` for rewards catalog
  - Create `src/models/RewardRedemption.ts` for redemptions
  - _Requirements: 14.2, 15.1, 15.3_

- [ ] 25. Implement loyalty service

  - Create `src/services/loyaltyService.ts` for loyalty operations
  - Add point earning logic on order completion
  - Add tier calculation and updates
  - Add point expiration handling
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.7, 14.8_

- [ ] 26. Implement rewards service

  - Create `src/services/rewardService.ts` for reward operations
  - Add reward redemption logic
  - Add reward code generation
  - Add reward validation and usage tracking
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7, 15.8_

- [ ] 27. Implement loyalty controller and routes
  - Create `src/controllers/loyaltyController.ts`
  - Create `src/routes/loyaltyRoutes.ts`
  - Add endpoints for points, rewards, and redemptions
  - _Requirements: 14.3, 14.6, 14.8, 15.1, 15.2_

## Phase 5: Reviews, Favorites & Notifications

- [ ] 28. Create Favorites model and endpoints

  - Create `src/models/Favorite.ts` for user favorites
  - Create `src/services/favoriteService.ts`
  - Create `src/controllers/favoriteController.ts` and routes
  - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

- [ ] 29. Create Review models

  - Create `src/models/Review.ts` for order reviews
  - Create `src/models/ProductReview.ts` for product-specific ratings
  - _Requirements: 17.1, 17.2, 17.3, 17.4_

- [ ] 30. Implement review service

  - Create `src/services/reviewService.ts` for review operations
  - Add review submission with moderation
  - Add rating calculation and updates
  - Add helpful count tracking
  - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 17.7, 17.8, 17.9_

- [ ] 31. Implement review controller and routes

  - Create `src/controllers/reviewController.ts`
  - Create `src/routes/reviewRoutes.ts`
  - Add endpoints for submitting and viewing reviews
  - _Requirements: 17.1, 17.9_

- [ ] 32. Create Notification models

  - Create `src/models/Notification.ts` for in-app notifications
  - Create `src/models/DeviceToken.ts` for FCM tokens
  - _Requirements: 18.1, 18.2, 23.1_

- [ ] 33. Implement notification service

  - Create `src/services/notificationService.ts` for notification management
  - Add notification creation for order status changes
  - Add notification creation for promotions
  - Respect user notification preferences
  - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5, 18.6_

- [ ] 34. Implement push notification service

  - Create `src/services/pushNotificationService.ts` for FCM integration
  - Add Firebase Admin SDK configuration
  - Add push notification sending logic
  - _Requirements: 18.7, 23.1, 23.2, 23.3, 23.4, 23.5_

- [ ] 35. Implement notification controller and routes
  - Create `src/controllers/notificationController.ts`
  - Create `src/routes/notificationRoutes.ts`
  - Add endpoints for viewing and managing notifications
  - _Requirements: 18.3, 18.4_

## Phase 6: Support, Announcements & Analytics

- [ ] 36. Create Announcement model and endpoints

  - Create `src/models/Announcement.ts` for announcements
  - Create `src/services/announcementService.ts`
  - Add announcement filtering by target audience
  - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5, 19.6_

- [ ] 37. Create Support models

  - Create `src/models/SupportTicket.ts` for support tickets
  - Create `src/models/SupportMessage.ts` for ticket messages
  - Create `src/models/Faq.ts` for FAQ management
  - _Requirements: 20.1, 20.2, 20.6, 21.1_

- [ ] 38. Implement support service

  - Create `src/services/supportService.ts` for ticket operations
  - Add ticket creation with unique ticket numbers
  - Add message threading
  - Add ticket status management
  - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 20.6, 20.7, 20.8_

- [ ] 39. Implement FAQ service and endpoints

  - Create `src/services/faqService.ts` for FAQ operations
  - Add FAQ retrieval with categorization
  - Add helpful/not helpful tracking
  - _Requirements: 21.1, 21.2, 21.3, 21.4, 21.5_

- [ ] 40. Implement support controller and routes

  - Create `src/controllers/supportController.ts`
  - Create `src/routes/supportRoutes.ts`
  - Add endpoints for tickets, messages, and FAQs
  - _Requirements: 20.1, 20.4, 20.5, 21.1_

- [ ] 41. Create Feedback model and endpoints

  - Create `src/models/Feedback.ts` for app feedback
  - Create `src/services/feedbackService.ts`
  - Create `src/controllers/feedbackController.ts` and routes
  - _Requirements: 22.1, 22.2, 22.3, 22.4, 22.5_

- [ ] 42. Create Analytics model and service

  - Create `src/models/AnalyticsEvent.ts` for event tracking
  - Create `src/services/analyticsService.ts`
  - Add event logging with partitioning
  - _Requirements: 25.1, 25.2, 25.3, 25.4, 25.5_

- [ ] 43. Implement home page aggregation
  - Create `src/services/homeService.ts` for aggregated data
  - Create `src/controllers/homeController.ts`
  - Create `src/routes/homeRoutes.ts`
  - Aggregate announcements, recommendations, and favorites
  - _Requirements: 19.1_

## Phase 7: System Features & Configuration

- [ ] 44. Create App Config model and endpoints

  - Create `src/models/AppConfig.ts` for system configuration
  - Add config retrieval endpoint
  - Add support for multi-currency and multi-language
  - _Requirements: 27.1_

- [ ] 45. Implement file upload service

  - Create `src/services/uploadService.ts` for file uploads
  - Configure multer middleware
  - Add S3 or CDN integration
  - _Requirements: 3.2, 17.3_

- [ ] 46. Add request validation schemas

  - Create `src/utils/validators.ts` with validation schemas
  - Add validation for all endpoints
  - Apply validation middleware to routes
  - _Requirements: 26.1, 26.5, 27.4_

- [ ] 47. Enhance error handling

  - Update error handler for consistent response format
  - Add validation error formatting
  - Ensure proper error codes (400, 401, 404, 422, 500)
  - _Requirements: 26.1, 26.2, 26.3, 26.4, 26.5_

- [ ] 48. Add security enhancements

  - Configure rate limiting per endpoint type
  - Add input sanitization
  - Ensure password exclusion from responses
  - Add request size limits
  - _Requirements: 27.2, 27.3, 27.4, 27.5, 27.6, 27.7_

- [ ] 49. Create health check and system endpoints

  - Add GET /health endpoint with database check
  - Add GET /config endpoint for app configuration
  - Add GET /payment-methods endpoint
  - _Requirements: 27.1_

- [ ] 50. Create database seed script
  - Create `src/scripts/seed.ts` for test data
  - Add seed data for stores with operating hours
  - Add seed data for products with customizations
  - Add seed data for categories, add-ons, and promo codes
  - _Requirements: 4.1, 5.1, 6.1_

## Phase 8: Testing (Optional)

- [ ]\* 51. Write unit tests for authentication

  - Write tests for JWT token generation and verification
  - Write tests for password hashing and comparison
  - Write tests for OTP generation and verification
  - Write tests for auth service functions
  - _Requirements: 1.1, 1.3, 1.5, 2.1, 2.2_

- [ ]\* 52. Write unit tests for cart service

  - Write tests for adding items to cart
  - Write tests for updating cart item quantities
  - Write tests for cart total calculation
  - Write tests for single-store validation
  - Write tests for promo code application
  - _Requirements: 9.1, 9.2, 9.3, 9.6, 9.7_

- [ ]\* 53. Write unit tests for order service

  - Write tests for order creation with valid data
  - Write tests for order validation
  - Write tests for pickup time validation
  - Write tests for order number generation
  - _Requirements: 11.1, 11.2, 11.3, 11.7_

- [ ]\* 54. Write unit tests for loyalty service

  - Write tests for point earning calculation
  - Write tests for tier updates
  - Write tests for reward redemption
  - _Requirements: 14.1, 14.4, 15.2_

- [ ]\* 55. Write integration tests for authentication flow

  - Write test for user registration with OTP
  - Write test for login with valid credentials
  - Write test for accessing protected routes
  - Write test for refresh token flow
  - _Requirements: 1.1, 1.3, 1.5, 1.9_

- [ ]\* 56. Write integration tests for order placement flow

  - Write test for complete order flow (cart to order)
  - Write test for order placement validation
  - Write test for cart clearing after order
  - Write test for order history retrieval
  - _Requirements: 11.1, 11.2, 11.12, 12.1_

- [ ]\* 57. Write integration tests for loyalty system
  - Write test for earning points on order completion
  - Write test for reward redemption
  - Write test for tier upgrades
  - _Requirements: 14.1, 14.4, 15.2_

## Phase 9: Documentation & Deployment

- [ ] 58. Add API documentation

  - Add JSDoc comments to all controller methods
  - Document request/response formats
  - Document authentication requirements
  - Document error responses
  - _Requirements: 26.1, 26.2, 26.3, 26.4_

- [ ] 59. Create deployment configuration

  - Set up environment-specific configurations
  - Configure MongoDB Atlas connection
  - Set up logging and monitoring
  - Configure CORS for production
  - _Requirements: 27.1, 27.5_

- [ ] 60. Final integration and testing
  - Test all endpoints end-to-end
  - Verify all requirements are met
  - Performance testing under load
  - Security audit
  - _Requirements: 27.1, 27.7_
