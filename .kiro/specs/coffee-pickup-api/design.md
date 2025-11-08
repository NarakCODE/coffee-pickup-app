# Design Document: Coffee Pickup API

> **Note**: This design document is aligned with the comprehensive API specification in `backend/API_DESIGN_SPECIFICATION.md` and database design in `backend/DATABASE_MODEL_DESIGN.md`. All models use "Store" terminology (not "Cafe") to match the database schema.

## Overview

The Coffee Pickup API is a comprehensive RESTful backend service built with Node.js, Express, TypeScript, and MongoDB. It enables users to browse coffee menus from multiple store locations, customize orders with detailed options, manage shopping carts, place pickup orders with multiple payment methods, track orders in real-time, participate in loyalty programs, and engage with support features. The system uses JWT-based authentication with email OTP verification and follows a clean, layered architecture pattern.

### Key Design Principles

- **Separation of Concerns**: Routes → Controllers → Services → Models pattern
- **Type Safety**: Full TypeScript implementation with strict mode
- **Error Handling**: Centralized error handling with custom error classes
- **Security**: JWT authentication with refresh tokens, OTP verification, input validation, rate limiting, and security headers
- **Scalability**: Stateless API design with MongoDB for data persistence
- **Maintainability**: Consistent code structure following existing patterns
- **Real-time Updates**: Support for webhooks and push notifications
- **Multi-currency**: Support for USD and KHR currencies
- **Localization**: Support for English and Khmer languages

## Architecture

### High-Level Architecture

```
┌─────────────┐
│   Client    │
│  (Mobile)   │
└──────┬──────┘
       │ HTTP/JSON
       ▼
┌─────────────────────────────────────┐
│         Express API Server          │
│  ┌───────────────────────────────┐  │
│  │   Security Middleware Layer   │  │
│  │  (Helmet, CORS, Rate Limit)   │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │   Authentication Middleware   │  │
│  │        (JWT Verify)           │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │      Routes Layer             │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │    Controllers Layer          │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │     Services Layer            │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │      Models Layer             │  │
│  └───────────────────────────────┘  │
└──────────────┬──────────────────────┘
               │
               ▼
        ┌─────────────┐
        │   MongoDB   │
        └─────────────┘
```

### Directory Structure

```
backend/src/
├── config/
│   ├── database.ts          # MongoDB connection
│   ├── env.ts               # Environment configuration
│   ├── payment.ts           # Payment provider configurations
│   ├── brevo.ts             # Brevo email service configuration
│   └── firebase.ts          # Firebase Admin SDK for FCM
├── controllers/
│   ├── authController.ts    # Authentication & OTP endpoints
│   ├── userController.ts    # User profile management
│   ├── storeController.ts   # Store/cafe location endpoints
│   ├── categoryController.ts # Category management
│   ├── productController.ts # Product/menu item endpoints
│   ├── cartController.ts    # Shopping cart endpoints
│   ├── orderController.ts   # Order management endpoints
│   ├── favoriteController.ts # Favorites management
│   ├── reviewController.ts  # Reviews and ratings
│   ├── loyaltyController.ts # Loyalty points and rewards
│   ├── promoController.ts   # Promo codes and promotions
│   ├── notificationController.ts # Notifications
│   ├── supportController.ts # Support tickets and FAQ
│   ├── feedbackController.ts # App feedback
│   └── homeController.ts    # Home page aggregated data
├── middlewares/
│   ├── auth.ts              # JWT authentication middleware
│   ├── errorHandler.ts      # Global error handler (existing)
│   ├── notFound.ts          # 404 handler (existing)
│   ├── security.ts          # Security middleware (existing)
│   ├── validateRequest.ts   # Request validation (existing)
│   ├── rateLimiter.ts       # Rate limiting configurations
│   └── upload.ts            # File upload middleware (multer)
├── models/
│   ├── User.ts              # User model with loyalty
│   ├── Otp.ts               # OTP verification model
│   ├── RefreshToken.ts      # Refresh token model
│   ├── Store.ts             # Store/cafe location model
│   ├── Category.ts          # Category model
│   ├── Product.ts           # Product/menu item model
│   ├── ProductCustomization.ts # Product customization options
│   ├── AddOn.ts             # Add-ons model
│   ├── ProductAddOn.ts      # Product-AddOn junction
│   ├── StoreInventory.ts    # Store inventory model
│   ├── Cart.ts              # Shopping cart model
│   ├── CartItem.ts          # Cart items model
│   ├── Order.ts             # Order model
│   ├── OrderItem.ts         # Order items model
│   ├── OrderStatusHistory.ts # Order status tracking
│   ├── Favorite.ts          # Favorites model
│   ├── Review.ts            # Reviews model
│   ├── ProductReview.ts     # Product reviews junction
│   ├── PromoCode.ts         # Promo codes model
│   ├── PromoCodeUsage.ts    # Promo code usage tracking
│   ├── Announcement.ts      # Announcements model
│   ├── Notification.ts      # Notifications model
│   ├── DeviceToken.ts       # Device tokens for FCM
│   ├── LoyaltyPointTransaction.ts # Loyalty points history
│   ├── Reward.ts            # Rewards catalog
│   ├── RewardRedemption.ts  # Reward redemptions
│   ├── SupportTicket.ts     # Support tickets
│   ├── SupportMessage.ts    # Support messages
│   ├── Faq.ts               # FAQ model
│   ├── Feedback.ts          # App feedback model
│   ├── AppConfig.ts         # App configuration
│   └── AnalyticsEvent.ts    # Analytics tracking
├── routes/
│   ├── index.ts             # Route aggregator (existing)
│   ├── authRoutes.ts        # Auth & OTP routes
│   ├── userRoutes.ts        # User profile routes
│   ├── storeRoutes.ts       # Store routes
│   ├── categoryRoutes.ts    # Category routes
│   ├── productRoutes.ts     # Product routes
│   ├── cartRoutes.ts        # Cart routes
│   ├── orderRoutes.ts       # Order routes
│   ├── favoriteRoutes.ts    # Favorites routes
│   ├── reviewRoutes.ts      # Reviews routes
│   ├── loyaltyRoutes.ts     # Loyalty & rewards routes
│   ├── promoRoutes.ts       # Promo codes routes
│   ├── notificationRoutes.ts # Notifications routes
│   ├── supportRoutes.ts     # Support routes
│   ├── feedbackRoutes.ts    # Feedback routes
│   ├── homeRoutes.ts        # Home page routes
│   └── systemRoutes.ts      # Health check & config
├── services/
│   ├── authService.ts       # Authentication & OTP logic
│   ├── userService.ts       # User profile logic
│   ├── storeService.ts      # Store business logic
│   ├── categoryService.ts   # Category logic
│   ├── productService.ts    # Product logic
│   ├── cartService.ts       # Cart business logic
│   ├── orderService.ts      # Order business logic
│   ├── favoriteService.ts   # Favorites logic
│   ├── reviewService.ts     # Reviews logic
│   ├── loyaltyService.ts    # Loyalty points logic
│   ├── rewardService.ts     # Rewards logic
│   ├── promoService.ts      # Promo codes logic
│   ├── notificationService.ts # Notifications logic
│   ├── supportService.ts    # Support tickets logic
│   ├── feedbackService.ts   # Feedback logic
│   ├── paymentService.ts    # Payment processing logic
│   ├── emailService.ts      # Email/OTP sending via Brevo
│   ├── pushNotificationService.ts # FCM push notifications
│   ├── uploadService.ts     # File upload to CDN/S3
│   └── analyticsService.ts  # Analytics tracking
├── types/
│   ├── index.ts             # Shared TypeScript types
│   ├── express.d.ts         # Express type extensions
│   └── models.ts            # Model interface types
├── utils/
│   ├── AppError.ts          # Custom error classes (existing)
│   ├── asyncHandler.ts      # Async wrapper (existing)
│   ├── jwt.ts               # JWT utilities
│   ├── validators.ts        # Validation schemas
│   ├── helpers.ts           # Helper functions
│   ├── constants.ts         # App constants
│   └── logger.ts            # Winston logger
├── scripts/
│   ├── seed.ts              # Database seeding script
│   └── migrate.ts           # Database migration script
└── index.ts                 # Application entry point (existing)
```

## Components and Interfaces

### 1. Authentication & Email OTP System

**Purpose**: Handle user registration with email verification, OTP management via Brevo, login, and JWT token management with refresh tokens

**Components**:

- `authController.ts`: Handle HTTP requests for auth endpoints
- `authService.ts`: Business logic for authentication and OTP
- `emailService.ts`: Send OTP via Brevo (transactional emails)
- `jwt.ts`: JWT token generation and verification utilities
- `auth.ts` middleware: Protect routes requiring authentication
- `Otp.ts` model: Store and verify OTP codes
- `RefreshToken.ts` model: Manage refresh tokens

**Key Functions**:

```typescript
// authService.ts
- registerUser(email, fullName, password, phoneNumber?, referralCode?): Promise<{ userId, otpSent }>
- verifyOtp(email, otpCode, verificationType): Promise<{ user, accessToken, refreshToken }>
- resendOtp(email): Promise<{ otpExpiresAt }>
- loginUser(email, password): Promise<{ user, accessToken, refreshToken }>
- forgotPassword(email): Promise<{ otpSent }>
- resetPassword(email, otpCode, newPassword): Promise<void>
- refreshAccessToken(refreshToken): Promise<{ accessToken }>
- logout(refreshToken): Promise<void>
- hashPassword(password): Promise<string>
- comparePassword(password, hashedPassword): Promise<boolean>

// emailService.ts (Brevo integration)
- sendOtpEmail(email, otpCode, userName): Promise<void>
- sendWelcomeEmail(email, userName): Promise<void>
- sendPasswordResetEmail(email, otpCode, userName): Promise<void>
- sendOrderConfirmationEmail(email, orderDetails): Promise<void>

// jwt.ts
- generateAccessToken(userId): string
- generateRefreshToken(userId, deviceInfo): string
- verifyAccessToken(token): { userId: string }
- verifyRefreshToken(token): { userId: string, tokenId: string }
```

**API Endpoints**:

- `POST /api/v1/auth/register` - Register new user (sends OTP to email)
- `POST /api/v1/auth/verify-otp` - Verify OTP
- `POST /api/v1/auth/resend-otp` - Resend OTP
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/forgot-password` - Request password reset OTP via email
- `POST /api/v1/auth/reset-password` - Reset password with OTP
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `POST /api/v1/auth/logout` - Logout and revoke refresh token

### 2. User Profile System

**Purpose**: Manage user profile information, preferences, and account settings

**Components**:

- `userController.ts`: Handle user profile requests
- `userService.ts`: Business logic for user operations
- `uploadService.ts`: Handle profile image uploads
- `User.ts`: Mongoose model for user data

**Key Functions**:

```typescript
// userService.ts
- getUserProfile(userId): Promise<User>
- updateProfile(userId, profileData): Promise<User>
- updateProfileImage(userId, imageFile): Promise<{ profileImage: string }>
- updatePassword(userId, currentPassword, newPassword): Promise<void>
- updateSettings(userId, preferences): Promise<User>
- deleteAccount(userId, password, reason): Promise<void>
- getReferralStats(userId): Promise<{ referralCode, totalReferrals, pointsEarned }>
```

**API Endpoints**:

- `GET /api/v1/profile` - Get user profile (protected)
- `PUT /api/v1/profile` - Update profile (protected)
- `POST /api/v1/profile/image` - Upload profile image (protected)
- `PUT /api/v1/profile/password` - Update password (protected)
- `PUT /api/v1/profile/settings` - Update preferences (protected)
- `DELETE /api/v1/profile` - Delete account (protected)

### 3. Store Location System

**Purpose**: Manage store locations with detailed information, operating hours, and features

**Components**:

- `storeController.ts`: Handle store-related requests
- `storeService.ts`: Business logic for store operations
- `Store.ts`: Mongoose model for store data

**Key Functions**:

```typescript
// storeService.ts
- getAllStores(lat?, lng?, radius?): Promise<Store[]>
- getStoreById(storeId): Promise<Store>
- getStoreBySlug(slug): Promise<Store>
- getAvailablePickupTimes(storeId, date): Promise<string[]>
- isStoreOpen(storeId): Promise<boolean>
- calculateDistance(lat1, lng1, lat2, lng2): number
```

**API Endpoints**:

- `GET /api/v1/stores` - List all active stores with distance filtering
- `GET /api/v1/stores/:id` - Get store details by ID
- `GET /api/v1/stores/slug/:slug` - Get store details by slug
- `GET /api/v1/stores/:id/pickup-times` - Get available pickup times

### 4. Category System

**Purpose**: Manage product categories with hierarchical structure

**Components**:

- `categoryController.ts`: Handle category requests
- `categoryService.ts`: Business logic for categories
- `Category.ts`: Mongoose model for categories

**Key Functions**:

```typescript
// categoryService.ts
- getAllCategories(): Promise<Category[]>
- getCategoryById(categoryId): Promise<Category>
- getCategoryBySlug(slug): Promise<Category>
- getSubcategories(parentCategoryId): Promise<Category[]>
```

**API Endpoints**:

- `GET /api/v1/categories` - List all active categories
- `GET /api/v1/categories/:id` - Get category details

### 5. Product & Menu System

**Purpose**: Manage coffee products/menu items with detailed customization options and add-ons

**Components**:

- `productController.ts`: Handle product-related requests
- `productService.ts`: Business logic for product operations
- `Product.ts`: Mongoose model for products
- `ProductCustomization.ts`: Customization options model
- `AddOn.ts`: Add-ons model
- `StoreInventory.ts`: Store-specific product availability

**Key Functions**:

```typescript
// productService.ts
- getProductsByStore(storeId, filters): Promise<Product[]>
- getProductById(productId, storeId?): Promise<Product>
- getProductBySlug(slug, storeId?): Promise<Product>
- searchProducts(query, filters): Promise<Product[]>
- getProductCustomizations(productId): Promise<ProductCustomization[]>
- getProductAddOns(productId): Promise<AddOn[]>
- calculateProductPrice(productId, customizations, addOns): Promise<number>
- checkProductAvailability(productId, storeId): Promise<boolean>
```

**API Endpoints**:

- `GET /api/v1/stores/:storeId/menu` - Get menu for a store with categories
- `GET /api/v1/products/:id` - Get product details
- `GET /api/v1/products/slug/:slug` - Get product by slug
- `GET /api/v1/products/search` - Search products

### 6. Shopping Cart System

**Purpose**: Manage user shopping carts with customized items, add-ons, promo codes, and pickup time

**Components**:

- `cartController.ts`: Handle cart-related requests
- `cartService.ts`: Business logic for cart operations
- `promoService.ts`: Promo code validation
- `Cart.ts`: Mongoose model for cart data
- `CartItem.ts`: Mongoose model for cart items

**Key Functions**:

```typescript
// cartService.ts
- getCart(userId): Promise<Cart>
- addItemToCart(userId, itemData): Promise<Cart>
- updateCartItem(userId, cartItemId, updateData): Promise<Cart>
- removeCartItem(userId, cartItemId): Promise<Cart>
- clearCart(userId): Promise<void>
- applyPromoCode(userId, promoCode): Promise<Cart>
- removePromoCode(userId): Promise<Cart>
- setPickupTime(userId, pickupTime): Promise<Cart>
- calculateCartTotals(cart): Promise<{ subtotal, discount, tax, total }>
- validateSingleStore(userId, storeId): Promise<boolean>
```

**API Endpoints**:

- `GET /api/v1/cart` - Get user's cart (protected)
- `POST /api/v1/cart/items` - Add item to cart (protected)
- `PUT /api/v1/cart/items/:id` - Update cart item (protected)
- `DELETE /api/v1/cart/items/:id` - Remove cart item (protected)
- `DELETE /api/v1/cart` - Clear cart (protected)
- `POST /api/v1/cart/promo-code` - Apply promo code (protected)
- `DELETE /api/v1/cart/promo-code` - Remove promo code (protected)
- `POST /api/v1/cart/pickup-time` - Set pickup time (protected)

### 7. Order System

**Purpose**: Handle order placement, payment processing, tracking, and history with status management

**Components**:

- `orderController.ts`: Handle order-related requests
- `orderService.ts`: Business logic for order operations
- `paymentService.ts`: Payment processing integration
- `loyaltyService.ts`: Loyalty points calculation
- `notificationService.ts`: Order notifications
- `Order.ts`: Mongoose model for order data
- `OrderItem.ts`: Mongoose model for order items
- `OrderStatusHistory.ts`: Order status tracking

**Key Functions**:

```typescript
// orderService.ts
- createOrder(userId, orderData): Promise<Order>
- confirmPayment(orderId, paymentData): Promise<Order>
- getOrderById(orderId, userId): Promise<Order>
- getUserOrders(userId, filters): Promise<Order[]>
- cancelOrder(orderId, userId, reason): Promise<Order>
- updateOrderStatus(orderId, newStatus, notes?): Promise<Order>
- generateOrderNumber(): string
- calculateOrderTotals(cartItems, promoCode?, loyaltyPoints?): Promise<OrderTotals>

// paymentService.ts
- initiatePayment(orderId, paymentMethod, amount): Promise<{ paymentUrl, transactionId }>
- verifyPayment(transactionId): Promise<{ success: boolean, status: string }>
- processRefund(orderId, amount): Promise<{ success: boolean }>
```

**API Endpoints**:

- `POST /api/v1/orders` - Place new order (protected)
- `POST /api/v1/orders/:id/confirm-payment` - Confirm payment (protected)
- `GET /api/v1/orders` - Get user's orders with filters (protected)
- `GET /api/v1/orders/:id` - Get specific order details (protected)
- `POST /api/v1/orders/:id/cancel` - Cancel order (protected)
- `POST /api/v1/orders/:id/rating` - Rate order (protected)

### 8. Additional Feature Systems

**8.1 Favorites System**

- `favoriteController.ts`, `favoriteService.ts`, `Favorite.ts`
- Endpoints: GET/POST/DELETE `/api/v1/favorites`

**8.2 Reviews & Ratings System**

- `reviewController.ts`, `reviewService.ts`, `Review.ts`, `ProductReview.ts`
- Endpoints: POST `/api/v1/orders/:id/rating`, GET `/api/v1/products/:id/reviews`

**8.3 Loyalty & Rewards System**

- `loyaltyController.ts`, `loyaltyService.ts`, `rewardService.ts`
- Models: `LoyaltyPointTransaction.ts`, `Reward.ts`, `RewardRedemption.ts`
- Endpoints: GET `/api/v1/loyalty/points`, GET `/api/v1/loyalty/rewards`, POST `/api/v1/loyalty/rewards/:id/redeem`

**8.4 Promo Codes System**

- `promoController.ts`, `promoService.ts`, `PromoCode.ts`, `PromoCodeUsage.ts`
- Endpoints: GET `/api/v1/promotions`, POST `/api/v1/promotions/validate`

**8.5 Notifications System**

- `notificationController.ts`, `notificationService.ts`, `pushNotificationService.ts`
- Models: `Notification.ts`, `DeviceToken.ts`
- Endpoints: GET `/api/v1/notifications`, PUT `/api/v1/notifications/:id/read`

**8.6 Announcements System**

- `Announcement.ts` model
- Endpoint: GET `/api/v1/announcements` (included in home page)

**8.7 Support System**

- `supportController.ts`, `supportService.ts`
- Models: `SupportTicket.ts`, `SupportMessage.ts`, `Faq.ts`
- Endpoints: GET `/api/v1/support/faq`, POST `/api/v1/support/tickets`, GET `/api/v1/support/tickets/:id`

**8.8 Feedback System**

- `feedbackController.ts`, `feedbackService.ts`, `Feedback.ts`
- Endpoint: POST `/api/v1/feedback`

**8.9 Home Page Aggregation**

- `homeController.ts`, `homeService.ts`
- Endpoint: GET `/api/v1/home` (aggregates announcements, recommendations, favorites)

**8.10 Analytics System**

- `analyticsService.ts`, `AnalyticsEvent.ts`
- Endpoint: POST `/api/v1/analytics/events`

**8.11 System APIs**

- Health check: GET `/api/v1/health`
- App config: GET `/api/v1/config`
- Payment methods: GET `/api/v1/payment-methods`

## Data Models

### User Model (Enhanced)

```typescript
interface IUser extends Document {
  email: string; // Primary identifier (unique, indexed)
  password: string;
  fullName: string;
  phoneNumber?: string; // Optional
  profileImage?: string;
  dateOfBirth?: Date;
  gender?: "male" | "female" | "other";
  emailVerified: boolean;
  phoneVerified: boolean;
  loyaltyPoints: number;
  loyaltyTier: "bronze" | "silver" | "gold" | "platinum";
  referralCode: string; // Unique code for referrals
  referredBy?: string; // Referral code of referrer
  totalOrders: number;
  totalSpent: number;
  preferences: {
    notificationsEnabled: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    language: "en" | "km";
    currency: "USD" | "KHR";
  };
  status: "active" | "suspended" | "deleted";
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date; // Soft delete
}
```

**Methods**:

- `hashPassword()`: Pre-save hook to hash password with bcrypt
- `comparePassword(password)`: Compare provided password with hashed password
- `toJSON()`: Transform to exclude password from responses
- `generateReferralCode()`: Generate unique referral code

### OTP Model

```typescript
interface IOtp extends Document {
  userId?: mongoose.Types.ObjectId; // Optional, for existing users
  email: string; // Email address for OTP
  otpCode: string; // 6-digit code
  verificationType: "registration" | "password_reset" | "email_verification";
  verified: boolean;
  attempts: number;
  maxAttempts: number; // Default: 5
  expiresAt: Date; // 10 minutes from creation
  verifiedAt?: Date;
  createdAt: Date;
}
```

**Indexes**:

- `email` + `verificationType` (compound index)
- `expiresAt` (TTL index for auto-deletion)

### Store Model

```typescript
interface IStore extends Document {
  name: string;
  slug: string; // URL-friendly identifier
  description?: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode?: string;
    country: string;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  phone: string;
  email?: string;
  imageUrl?: string;
  operatingHours: {
    monday: { open: string; close: string };
    tuesday: { open: string; close: string };
    wednesday: { open: string; close: string };
    thursday: { open: string; close: string };
    friday: { open: string; close: string };
    saturday: { open: string; close: string };
    sunday: { open: string; close: string };
  };
  specialHours?: { date: string; open: string; close: string }[]; // Holidays
  isOpen: boolean;
  isActive: boolean;
  averagePrepTime: number; // Minutes
  rating?: number;
  totalReviews: number;
  features: {
    parking: boolean;
    wifi: boolean;
    outdoorSeating: boolean;
    driveThrough: boolean;
  };
  managerId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
```

**Methods**:

- `isOpenNow()`: Check if store is currently open
- `getPickupTimes(date)`: Generate available pickup time slots

### Product Model

```typescript
interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  categoryId: mongoose.Types.ObjectId;
  images: string[]; // Array of image URLs
  basePrice: number;
  currency: "USD" | "KHR";
  preparationTime: number; // Minutes
  calories?: number;
  rating?: number;
  totalReviews: number;
  isAvailable: boolean;
  isFeatured: boolean;
  isBestSelling: boolean;
  allergens: string[];
  tags: string[];
  nutritionalInfo?: {
    protein: number;
    carbohydrates: number;
    fat: number;
    caffeine: number;
  };
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date; // Soft delete
}
```

### ProductCustomization Model

```typescript
interface IProductCustomization extends Document {
  productId: mongoose.Types.ObjectId;
  customizationType: "size" | "sugar_level" | "ice_level" | "coffee_level";
  options: {
    id: string;
    name: string;
    priceModifier: number;
    isDefault: boolean;
  }[];
  isRequired: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Cart Model

```typescript
interface ICartItem {
  menuItemId: mongoose.Types.ObjectId;
  name: string;
  basePrice: number;
  quantity: number;
  customizations: {
    optionName: string;
    choiceName: string;
    additionalPrice: number;
  }[];
  specialInstructions?: string;
  itemTotal: number;
}

interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  cafeId?: mongoose.Types.ObjectId;
  items: ICartItem[];
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}
```

**Methods**:

- `calculateTotal()`: Calculate total price of all items
- `validateSingleCafe()`: Ensure all items are from same cafe

### Order Model

```typescript
interface IOrderItem {
  menuItemId: mongoose.Types.ObjectId;
  name: string;
  basePrice: number;
  quantity: number;
  customizations: {
    optionName: string;
    choiceName: string;
    additionalPrice: number;
  }[];
  specialInstructions?: string;
  itemTotal: number;
}

interface IOrder extends Document {
  orderNumber: string; // "ORD-20250127-001"
  userId: mongoose.Types.ObjectId;
  cafeId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalPrice: number;
  pickupTime: Date;
  status: "pending" | "preparing" | "ready" | "completed" | "cancelled";
  paymentStatus: "pending" | "completed" | "failed";
  paymentMethod: "mock";
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes**:

- `userId` + `createdAt` (for user order history queries)
- `orderNumber` (unique, for quick lookups)
- `status` (for filtering)

## Error Handling

### Error Flow

1. Errors thrown in services/controllers are caught by `asyncHandler` wrapper
2. Operational errors (AppError instances) are handled gracefully
3. Unexpected errors are logged and return generic 500 response
4. Validation errors return 400 with detailed field-level messages

### Error Types (Using Existing Pattern)

```typescript
// Existing in AppError.ts
- AppError: Base error class
- NotFoundError: 404 errors
- BadRequestError: 400 errors
- UnauthorizedError: 401 errors
- ForbiddenError: 403 errors
```

### Validation Strategy

- Use middleware validation for request body/params
- Validate business rules in service layer
- Return structured validation errors with field names
- Sanitize all user inputs

## Testing Strategy

### Unit Tests

**Models**:

- Test schema validation
- Test model methods (e.g., `isOpenNow()`, `calculateTotal()`)
- Test pre/post hooks (e.g., password hashing)

**Services**:

- Test business logic in isolation
- Mock database calls
- Test error scenarios
- Test edge cases (empty cart, invalid times, etc.)

**Utilities**:

- Test JWT generation and verification
- Test password hashing and comparison
- Test validation functions

### Integration Tests

**API Endpoints**:

- Test complete request/response cycles
- Test authentication flow
- Test cart operations (add, update, remove)
- Test order placement flow
- Test error responses
- Test authorization (users can only access their own data)

**Database**:

- Test model CRUD operations
- Test relationships between models
- Test indexes and queries

### Test Data

- Create seed scripts for cafes and menu items
- Use test users with known credentials
- Mock payment processing
- Use fixed dates/times for pickup time testing

## Security Considerations

### Authentication & Authorization

- JWT tokens with reasonable expiration (24 hours)
- Passwords hashed with bcrypt (10 salt rounds)
- Protected routes require valid JWT
- Users can only access their own carts and orders

### Input Validation

- Validate all request bodies using middleware
- Sanitize inputs to prevent injection attacks
- Validate data types and formats
- Enforce reasonable limits (quantity, string lengths)

### Rate Limiting

- Use existing rate limiter middleware
- Limit auth endpoints more strictly (5 requests/15 min)
- General API limit (100 requests/15 min)

### CORS Configuration

- Configure allowed origins from environment
- Allow credentials for JWT cookies (if used)
- Restrict methods to necessary ones

### Data Protection

- Never expose passwords in responses
- Log errors without sensitive data
- Use HTTPS in production
- Implement request size limits

## API Response Formats

### Success Response

```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "statusCode": 400,
    "errors": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### Pagination Response (Future Enhancement)

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

## Environment Configuration

### Required Environment Variables

```
# Server
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/coffee-pickup

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=7d

# Brevo (Email Service)
BREVO_API_KEY=your-brevo-api-key
BREVO_SENDER_EMAIL=noreply@coffee-app.com
BREVO_SENDER_NAME=Coffee Pickup App

# Firebase (Push Notifications)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# Payment (Optional for MVP)
PAYMENT_PROVIDER_API_KEY=your-payment-key

# File Upload (Optional)
AWS_S3_BUCKET=your-bucket-name
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

## Performance Considerations

### Database Optimization

- Add indexes on frequently queried fields
- Use lean queries when full documents not needed
- Implement pagination for large result sets (future)
- Use aggregation pipeline for complex queries

### Caching Strategy (Future Enhancement)

- Cache cafe locations (rarely change)
- Cache menu items per cafe
- Invalidate cache on updates
- Use Redis for session storage (if needed)

### Response Optimization

- Use compression middleware (already implemented)
- Minimize payload sizes
- Use projection to exclude unnecessary fields
- Implement field selection via query params (future)

## Deployment Considerations

### Environment Setup

- Development: Local MongoDB
- Production: MongoDB Atlas or managed instance
- Use environment-specific configurations
- Implement health check endpoint

### Monitoring & Logging

- Use existing morgan logger for HTTP requests
- Add structured logging for errors
- Monitor response times
- Track failed authentication attempts

### Scalability

- Stateless API design (horizontal scaling ready)
- Database connection pooling
- Consider load balancer for multiple instances
- Separate read/write operations (future)

## Future Enhancements

### Phase 2 Features

- Real payment integration (Stripe)
- Order status updates (WebSocket/SSE)
- Push notifications for order ready
- User favorites and order history
- Loyalty points system
- Admin dashboard for cafe management

### Technical Improvements

- GraphQL API option
- Real-time order tracking
- Advanced caching layer
- Microservices architecture
- Event-driven architecture
- Comprehensive API documentation (Swagger/OpenAPI)
