# Design Document: Coffee Pickup API

## Overview

The Coffee Pickup API is a RESTful backend service built with Node.js, Express, TypeScript, and MongoDB. It enables users to browse coffee menus from multiple cafe locations, customize orders, manage shopping carts, and place pickup orders with mock payment processing. The system uses JWT-based authentication and follows a clean, layered architecture pattern already established in the codebase.

### Key Design Principles

- **Separation of Concerns**: Routes → Controllers → Services → Models pattern
- **Type Safety**: Full TypeScript implementation with strict mode
- **Error Handling**: Centralized error handling with custom error classes
- **Security**: JWT authentication, input validation, rate limiting, and security headers
- **Scalability**: Stateless API design with MongoDB for data persistence
- **Maintainability**: Consistent code structure following existing patterns

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
│   └── env.ts               # Environment configuration
├── controllers/
│   ├── authController.ts    # Authentication endpoints
│   ├── cafeController.ts    # Cafe location endpoints
│   ├── menuController.ts    # Menu item endpoints
│   ├── cartController.ts    # Shopping cart endpoints
│   └── orderController.ts   # Order management endpoints
├── middlewares/
│   ├── auth.ts              # JWT authentication middleware
│   ├── errorHandler.ts      # Global error handler (existing)
│   ├── notFound.ts          # 404 handler (existing)
│   ├── security.ts          # Security middleware (existing)
│   └── validateRequest.ts   # Request validation (existing)
├── models/
│   ├── User.ts              # User model (existing)
│   ├── Cafe.ts              # Cafe location model
│   ├── MenuItem.ts          # Coffee menu item model
│   ├── Cart.ts              # Shopping cart model
│   └── Order.ts             # Order model
├── routes/
│   ├── index.ts             # Route aggregator (existing)
│   ├── authRoutes.ts        # Auth routes
│   ├── cafeRoutes.ts        # Cafe routes
│   ├── menuRoutes.ts        # Menu routes
│   ├── cartRoutes.ts        # Cart routes
│   └── orderRoutes.ts       # Order routes
├── services/
│   ├── authService.ts       # Authentication business logic
│   ├── cafeService.ts       # Cafe business logic
│   ├── menuService.ts       # Menu business logic
│   ├── cartService.ts       # Cart business logic
│   └── orderService.ts      # Order business logic
├── types/
│   └── index.ts             # Shared TypeScript types
├── utils/
│   ├── AppError.ts          # Custom error classes (existing)
│   ├── asyncHandler.ts      # Async wrapper (existing)
│   ├── jwt.ts               # JWT utilities
│   └── validators.ts        # Validation schemas
└── index.ts                 # Application entry point (existing)
```

## Components and Interfaces

### 1. Authentication System

**Purpose**: Handle user registration, login, and JWT token management

**Components**:
- `authController.ts`: Handle HTTP requests for auth endpoints
- `authService.ts`: Business logic for authentication
- `jwt.ts`: JWT token generation and verification utilities
- `auth.ts` middleware: Protect routes requiring authentication

**Key Functions**:
```typescript
// authService.ts
- registerUser(name, email, password): Promise<{ user, token }>
- loginUser(email, password): Promise<{ user, token }>
- hashPassword(password): Promise<string>
- comparePassword(password, hashedPassword): Promise<boolean>

// jwt.ts
- generateToken(userId): string
- verifyToken(token): { userId: string }
```

**API Endpoints**:
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### 2. Cafe Location System

**Purpose**: Manage cafe locations and their operating information

**Components**:
- `cafeController.ts`: Handle cafe-related requests
- `cafeService.ts`: Business logic for cafe operations
- `Cafe.ts`: Mongoose model for cafe data

**Key Functions**:
```typescript
// cafeService.ts
- getAllCafes(): Promise<Cafe[]>
- getCafeById(cafeId): Promise<Cafe>
- getAvailablePickupTimes(cafeId, date): Promise<string[]>
- isCafeOpen(cafeId): Promise<boolean>
```

**API Endpoints**:
- `GET /api/cafes` - List all active cafes
- `GET /api/cafes/:id` - Get cafe details
- `GET /api/cafes/:id/pickup-times` - Get available pickup times

### 3. Menu System

**Purpose**: Manage coffee menu items and customization options

**Components**:
- `menuController.ts`: Handle menu-related requests
- `menuService.ts`: Business logic for menu operations
- `MenuItem.ts`: Mongoose model for menu items

**Key Functions**:
```typescript
// menuService.ts
- getMenuByCafe(cafeId): Promise<MenuItem[]>
- getMenuItemById(itemId): Promise<MenuItem>
- getMenuItemsByCategory(cafeId, category): Promise<MenuItem[]>
- calculateItemPrice(itemId, customizations): Promise<number></number>``

**API Endpoints**:
- `GET /api/cafes/:cafeId/menu` - Get menu for a cafe
- `GET /api/menu/:id` - Get specific menu item details

### 4. Shopping Cart System

**Purpose**: Manage user shopping carts with customized items

**Components**:
- `cartController.ts`: Handle cart-related requests
- `cartService.ts`: Business logic for cart operations
- `Cart.ts`: Mongoose model for cart data

**Key Functions**:
```typescript
// cartService.ts
- getCart(userId): Promise<Cart>
- addItemToCart(userId, itemData): Promise<Cart>
- updateCartItem(userId, cartItemId, quantity): Promise<Cart>
- removeCartItem(userId, cartItemId): Promise<Cart>
- clearCart(userId): Promise<void>
- calculateCartTotal(userId): Promise<number>
- validateCartCafe(userId, cafeId): Promise<boolean>
```

**API Endpoints**:
- `GET /api/cart` - Get user's cart (protected)
- `POST /api/cart/items` - Add item to cart (protected)
- `PATCH /api/cart/items/:id` - Update cart item (protected)
- `DELETE /api/cart/items/:id` - Remove cart item (protected)
- `DELETE /api/cart` - Clear cart (protected)

### 5. Order System

**Purpose**: Handle order placement, tracking, and history

**Components**:
- `orderController.ts`: Handle order-related requests
- `orderService.ts`: Business logic for order operations
- `Order.ts`: Mongoose model for order data

**Key Functions**:
```typescript
// orderService.ts
- createOrder(userId, orderData): Promise<Order>
- getOrderById(orderId, userId): Promise<Order>
- getUserOrders(userId, filters): Promise<Order[]>
- generateOrderNumber(): string
- validateOrderData(orderData): Promise<boolean>
- processMockPayment(amount): Promise<{ success: boolean }>
```

**API Endpoints**:
- `POST /api/orders` - Place new order (protected)
- `GET /api/orders` - Get user's orders (protected)
- `GET /api/orders/:id` - Get specific order details (protected)

## Data Models

### User Model (Existing - Enhanced)

```typescript
interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**Enhancements Needed**:
- Add password hashing pre-save hook
- Add method to compare passwords
- Add method to generate JWT token
- Exclude password from JSON responses

### Cafe Model

```typescript
interface ICafe extends Document {
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  operatingHours: {
    dayOfWeek: number; // 0-6 (Sunday-Saturday)
    openTime: string;  // "08:00"
    closeTime: string; // "20:00"
  }[];
  isActive: boolean;
  phoneNumber: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**Methods**:
- `isOpenNow()`: Check if cafe is currently open
- `getPickupTimes(date)`: Generate available pickup time slots

### MenuItem Model

```typescript
interface ICustomizationOption {
  name: string;          // "Size", "Milk Type", "Sweetness"
  type: 'single' | 'multiple';
  required: boolean;
  choices: {
    name: string;        // "Large", "Oat Milk", "Extra Sweet"
    additionalPrice: number;
  }[];
}

interface IMenuItem extends Document {
  cafeId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  category: string;      // "Espresso", "Cold Brew", "Specialty"
  basePrice: number;
  imageUrl?: string;
  customizationOptions: ICustomizationOption[];
  isAvailable: boolean;
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
  orderNumber: string;   // "ORD-20250127-001"
  userId: mongoose.Types.ObjectId;
  cafeId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalPrice: number;
  pickupTime: Date;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentMethod: 'mock';
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
PORT=3000
MONGODB_URI=mongodb://localhost:27017/coffee-pickup
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
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
