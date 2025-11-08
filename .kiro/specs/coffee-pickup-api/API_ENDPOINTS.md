# Coffee Pickup API - Complete Endpoint List

Base URL: `/api/v1`

## 1. Authentication Endpoints (8 endpoints)

| Method | Endpoint                | Description                            | Auth Required |
| ------ | ----------------------- | -------------------------------------- | ------------- |
| POST   | `/auth/register`        | Register new user (sends OTP to email) | No            |
| POST   | `/auth/verify-otp`      | Verify OTP code                        | No            |
| POST   | `/auth/resend-otp`      | Resend OTP to email                    | No            |
| POST   | `/auth/login`           | Login user                             | No            |
| POST   | `/auth/forgot-password` | Request password reset OTP via email   | No            |
| POST   | `/auth/reset-password`  | Reset password with OTP                | No            |
| POST   | `/auth/refresh-token`   | Refresh access token                   | No            |
| POST   | `/auth/logout`          | Logout and revoke refresh token        | Yes           |

## 2. User Profile Endpoints (6 endpoints)

| Method | Endpoint            | Description                | Auth Required |
| ------ | ------------------- | -------------------------- | ------------- |
| GET    | `/profile`          | Get user profile           | Yes           |
| PUT    | `/profile`          | Update profile information | Yes           |
| POST   | `/profile/image`    | Upload profile image       | Yes           |
| PUT    | `/profile/password` | Update password            | Yes           |
| PUT    | `/profile/settings` | Update user preferences    | Yes           |
| DELETE | `/profile`          | Delete account             | Yes           |

## 3. Store Location Endpoints (4 endpoints)

| Method | Endpoint                   | Description                                      | Auth Required |
| ------ | -------------------------- | ------------------------------------------------ | ------------- |
| GET    | `/stores`                  | List all active stores (with distance filtering) | No            |
| GET    | `/stores/:id`              | Get store details by ID                          | No            |
| GET    | `/stores/slug/:slug`       | Get store details by slug                        | No            |
| GET    | `/stores/:id/pickup-times` | Get available pickup times for store             | No            |

## 4. Category Endpoints (2 endpoints)

| Method | Endpoint          | Description                | Auth Required |
| ------ | ----------------- | -------------------------- | ------------- |
| GET    | `/categories`     | List all active categories | No            |
| GET    | `/categories/:id` | Get category details       | No            |

## 5. Product & Menu Endpoints (4 endpoints)

| Method | Endpoint                | Description                          | Auth Required |
| ------ | ----------------------- | ------------------------------------ | ------------- |
| GET    | `/stores/:storeId/menu` | Get menu for a store with categories | No            |
| GET    | `/products/:id`         | Get product details                  | No            |
| GET    | `/products/slug/:slug`  | Get product by slug                  | No            |
| GET    | `/products/search`      | Search products                      | No            |

## 6. Shopping Cart Endpoints (8 endpoints)

| Method | Endpoint            | Description                 | Auth Required |
| ------ | ------------------- | --------------------------- | ------------- |
| GET    | `/cart`             | Get user's cart             | Yes           |
| POST   | `/cart/items`       | Add item to cart            | Yes           |
| PUT    | `/cart/items/:id`   | Update cart item            | Yes           |
| DELETE | `/cart/items/:id`   | Remove cart item            | Yes           |
| DELETE | `/cart`             | Clear entire cart           | Yes           |
| POST   | `/cart/promo-code`  | Apply promo code to cart    | Yes           |
| DELETE | `/cart/promo-code`  | Remove promo code from cart | Yes           |
| POST   | `/cart/pickup-time` | Set pickup time for cart    | Yes           |

## 7. Order Endpoints (6 endpoints)

| Method | Endpoint                      | Description                      | Auth Required |
| ------ | ----------------------------- | -------------------------------- | ------------- |
| POST   | `/orders`                     | Place new order                  | Yes           |
| POST   | `/orders/:id/confirm-payment` | Confirm payment for order        | Yes           |
| GET    | `/orders`                     | Get user's orders (with filters) | Yes           |
| GET    | `/orders/:id`                 | Get specific order details       | Yes           |
| POST   | `/orders/:id/cancel`          | Cancel order                     | Yes           |
| POST   | `/orders/:id/rating`          | Rate and review order            | Yes           |

## 8. Favorites Endpoints (3 endpoints)

| Method | Endpoint                | Description                   | Auth Required |
| ------ | ----------------------- | ----------------------------- | ------------- |
| GET    | `/favorites`            | Get user's favorite products  | Yes           |
| POST   | `/favorites`            | Add product to favorites      | Yes           |
| DELETE | `/favorites/:productId` | Remove product from favorites | Yes           |

## 9. Reviews Endpoints (2 endpoints)

| Method | Endpoint                | Description                                 | Auth Required |
| ------ | ----------------------- | ------------------------------------------- | ------------- |
| POST   | `/orders/:id/rating`    | Submit order review (duplicate from orders) | Yes           |
| GET    | `/products/:id/reviews` | Get reviews for a product                   | No            |

## 10. Loyalty & Rewards Endpoints (5 endpoints)

| Method | Endpoint                      | Description                            | Auth Required |
| ------ | ----------------------------- | -------------------------------------- | ------------- |
| GET    | `/loyalty/points`             | Get user's loyalty points balance      | Yes           |
| GET    | `/loyalty/points/history`     | Get loyalty points transaction history | Yes           |
| GET    | `/loyalty/rewards`            | Get available rewards catalog          | Yes           |
| POST   | `/loyalty/rewards/:id/redeem` | Redeem a reward                        | Yes           |
| GET    | `/loyalty/redeemed`           | Get user's redeemed rewards            | Yes           |

## 11. Promo Codes Endpoints (2 endpoints)

| Method | Endpoint               | Description           | Auth Required |
| ------ | ---------------------- | --------------------- | ------------- |
| GET    | `/promotions`          | Get active promotions | Yes           |
| POST   | `/promotions/validate` | Validate promo code   | Yes           |

## 12. Notifications Endpoints (5 endpoints)

| Method | Endpoint                      | Description                    | Auth Required |
| ------ | ----------------------------- | ------------------------------ | ------------- |
| GET    | `/notifications`              | Get user's notifications       | Yes           |
| PUT    | `/notifications/:id/read`     | Mark notification as read      | Yes           |
| PUT    | `/notifications/read-all`     | Mark all notifications as read | Yes           |
| DELETE | `/notifications/:id`          | Delete notification            | Yes           |
| GET    | `/notifications/unread-count` | Get unread notification count  | Yes           |

## 13. Announcements Endpoints (1 endpoint)

| Method | Endpoint         | Description              | Auth Required |
| ------ | ---------------- | ------------------------ | ------------- |
| GET    | `/announcements` | Get active announcements | No            |

## 14. Support Endpoints (7 endpoints)

| Method | Endpoint                        | Description                      | Auth Required |
| ------ | ------------------------------- | -------------------------------- | ------------- |
| GET    | `/support/faq`                  | Get FAQ list                     | No            |
| GET    | `/support/faq/search`           | Search FAQ                       | No            |
| POST   | `/support/tickets`              | Create support ticket            | Yes           |
| GET    | `/support/tickets`              | Get user's support tickets       | Yes           |
| GET    | `/support/tickets/:id`          | Get ticket details with messages | Yes           |
| POST   | `/support/tickets/:id/messages` | Reply to support ticket          | Yes           |
| PUT    | `/support/tickets/:id/close`    | Close support ticket             | Yes           |

## 15. Feedback Endpoints (1 endpoint)

| Method | Endpoint    | Description         | Auth Required |
| ------ | ----------- | ------------------- | ------------- |
| POST   | `/feedback` | Submit app feedback | Yes           |

## 16. Home Page Endpoints (1 endpoint)

| Method | Endpoint | Description                     | Auth Required |
| ------ | -------- | ------------------------------- | ------------- |
| GET    | `/home`  | Get home page data (aggregated) | Yes           |

## 17. Analytics Endpoints (1 endpoint)

| Method | Endpoint            | Description           | Auth Required |
| ------ | ------------------- | --------------------- | ------------- |
| POST   | `/analytics/events` | Track analytics event | Yes           |

## 18. System Endpoints (3 endpoints)

| Method | Endpoint           | Description                   | Auth Required |
| ------ | ------------------ | ----------------------------- | ------------- |
| GET    | `/health`          | Health check                  | No            |
| GET    | `/config`          | Get app configuration         | No            |
| GET    | `/payment-methods` | Get available payment methods | No            |

---

## Summary

**Total Endpoints: 69**

### By Category:

- Authentication: 8 endpoints
- User Profile: 6 endpoints
- Stores: 4 endpoints
- Categories: 2 endpoints
- Products/Menu: 4 endpoints
- Cart: 8 endpoints
- Orders: 6 endpoints
- Favorites: 3 endpoints
- Reviews: 2 endpoints
- Loyalty & Rewards: 5 endpoints
- Promo Codes: 2 endpoints
- Notifications: 5 endpoints
- Announcements: 1 endpoint
- Support: 7 endpoints
- Feedback: 1 endpoint
- Home: 1 endpoint
- Analytics: 1 endpoint
- System: 3 endpoints

### By Authentication:

- **Public Endpoints (No Auth Required): 19**
- **Protected Endpoints (Auth Required): 50**

### By HTTP Method:

- **GET**: 32 endpoints
- **POST**: 24 endpoints
- **PUT**: 7 endpoints
- **DELETE**: 6 endpoints
