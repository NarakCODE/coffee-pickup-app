# Coffee Pickup Mobile App - API Design Specification

## Base URL

```json
Production: https://api.coffee-app.com/v1
Staging: https://api-staging.coffee-app.com/v1
Development: http://localhost:8081/api/v1
```

# Summary Endpoints

[API Endpoints List](https://www.notion.so/API-Endpoints-List-2a5c347927218085bbf8f9fc9f3db7ed?pvs=21)

[Development Timeline & Workflow](https://www.notion.so/Development-Timeline-Workflow-2a5c347927218033a53cd24989a9afd5?pvs=21)

[Database Models & Schema Structure](https://www.notion.so/Database-Models-Schema-Structure-2a5c3479272180b1ba34f6d8edbe4291?pvs=21)

## Authentication

All authenticated endpoints require Bearer token in header:

```json
Authorization: Bearer {access_token}
```

---

## 1. AUTHENTICATION APIs

### 1.1 Register Account

```json
POST /auth/register
Content-Type: application/json

Request:
{
  "phone_number": "+855123456789",
  "email": "[user@example.com](mailto:user@example.com)",
  "password": "SecurePass123!",
  "full_name": "John Doe",
  "referral_code": "FRIEND123" // optional
}

Response: 201 Created
{
  "success": true,
  "data": {
    "user_id": "usr_1234567890",
    "phone_number": "+855123456789",
    "email": "[user@example.com](mailto:user@example.com)",
    "otp_sent": true,
    "otp_expires_at": "2025-11-08T10:15:00Z"
  },
  "message": "OTP sent to your phone"
}
```

### 1.2 Verify OTP

```json
POST /auth/verify-otp
Content-Type: application/json

Request:
{
  "phone_number": "+855123456789",
  "otp_code": "123456",
  "verification_type": "registration" // or "password_reset"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "user_id": "usr_1234567890",
    "verified": true,
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 3600
  }
}
```

### 1.3 Resend OTP

```json
POST /auth/resend-otp
Content-Type: application/json

Request:
{
  "phone_number": "+855123456789"
}

Response: 200 OK
{
  "success": true,
  "message": "OTP resent successfully",
  "data": {
    "otp_expires_at": "2025-11-08T10:20:00Z"
  }
}
```

### 1.4 Login

```json
POST /auth/login
Content-Type: application/json

Request:
{
  "phone_number": "+855123456789",
  "password": "SecurePass123!"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "user_id": "usr_1234567890",
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 3600,
    "user": {
      "full_name": "John Doe",
      "email": "[user@example.com](mailto:user@example.com)",
      "phone_number": "+855123456789",
      "profile_image": "https://cdn.coffee-app.com/users/profile.jpg"
    }
  }
}
```

### 1.5 Forgot Password

```json
POST /auth/forgot-password
Content-Type: application/json

Request:
{
  "phone_number": "+855123456789"
}

Response: 200 OK
{
  "success": true,
  "message": "OTP sent to your phone",
  "data": {
    "otp_expires_at": "2025-11-08T10:15:00Z"
  }
}
```

### 1.6 Reset Password

```json
POST /auth/reset-password
Content-Type: application/json

Request:
{
  "phone_number": "+855123456789",
  "otp_code": "123456",
  "new_password": "NewSecurePass123!"
}

Response: 200 OK
{
  "success": true,
  "message": "Password reset successfully"
}
```

### 1.7 Refresh Token

```json
POST /auth/refresh-token
Content-Type: application/json

Request:
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response: 200 OK
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 3600
  }
}
```

### 1.8 Logout

```json
POST /auth/logout
Authorization: Bearer {access_token}

Response: 200 OK
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 2. HOME PAGE APIs

### 2.1 Get Home Data (Aggregated)

```json
GET /home
Authorization: Bearer {access_token}

Response: 200 OK
{
  "success": true,
  "data": {
    "announcements": [
      {
        "id": "ann_001",
        "title": "Grand Opening Sale!",
        "description": "Get 20% off on all drinks",
        "image_url": "https://cdn.coffee-app.com/banners/sale.jpg",
        "start_date": "2025-11-01T00:00:00Z",
        "end_date": "2025-11-15T23:59:59Z",
        "action_type": "promo_code", // or "deep_link", "external_url"
        "action_value": "GRAND20",
        "priority": 1
      }
    ],
    "recommendations": [
      {
        "id": "prd_001",
        "name": "Caramel Macchiato",
        "description": "Espresso with vanilla and caramel",
        "image_url": "https://cdn.coffee-app.com/products/caramel-macchiato.jpg",
        "base_price": 4.50,
        "currency": "USD",
        "rating": 4.8,
        "total_reviews": 245,
        "category": "hot_coffee",
        "is_favorite": true,
        "available": true,
        "preparation_time": 5 // minutes
      }
    ],
    "favorites": [
      {
        "id": "prd_002",
        "name": "Iced Latte",
        "description": "Cold espresso with milk",
        "image_url": "https://cdn.coffee-app.com/products/iced-latte.jpg",
        "base_price": 3.75,
        "currency": "USD",
        "rating": 4.6,
        "total_reviews": 189,
        "category": "iced_coffee",
        "is_favorite": true,
        "available": true
      }
    ]
  }
}
```

### 2.2 Get Announcements Only

```json
GET /announcements?active=true
Authorization: Bearer {access_token}

Query Parameters:
- active: boolean (optional, default: true)
- page: integer (optional, default: 1)
- limit: integer (optional, default: 10)

Response: 200 OK
{
  "success": true,
  "data": [...],
  "pagination": {
    "current_page": 1,
    "total_pages": 2,
    "total_items": 15,
    "items_per_page": 10
  }
}
```

---

## 3. MENU PAGE APIs

### 3.1 Get Store Locations

```json
GET /stores?lat=11.5564&lng=104.9282&radius=10
Authorization: Bearer {access_token}

Query Parameters:
- lat: float (required) - User's latitude
- lng: float (required) - User's longitude
- radius: integer (optional, km, default: 10)

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": "store_001",
      "name": "Coffee Shop - Central Market",
      "address": "St. 110, Phnom Penh, Cambodia",
      "lat": 11.5564,
      "lng": 104.9282,
      "distance": 2.3, // km
      "phone": "+855123456789",
      "opening_hours": {
        "monday": {"open": "07:00", "close": "22:00"},
        "tuesday": {"open": "07:00", "close": "22:00"},
        "wednesday": {"open": "07:00", "close": "22:00"},
        "thursday": {"open": "07:00", "close": "22:00"},
        "friday": {"open": "07:00", "close": "23:00"},
        "saturday": {"open": "08:00", "close": "23:00"},
        "sunday": {"open": "08:00", "close": "22:00"}
      },
      "is_open": true,
      "estimated_prep_time": 15, // minutes
      "image_url": "https://cdn.coffee-app.com/stores/central-market.jpg"
    }
  ]
}
```

### 3.2 Get Menu by Store

```json
GET /stores/{store_id}/menu?category=all
Authorization: Bearer {access_token}

Query Parameters:
- category: string (optional) - "all", "best_selling", "hot_coffee", "iced_coffee", "desserts", "add_ons"
- available_only: boolean (optional, default: true)

Response: 200 OK
{
  "success": true,
  "data": {
    "store_id": "store_001",
    "categories": [
      {
        "id": "cat_001",
        "name": "Best Selling",
        "slug": "best_selling",
        "display_order": 1,
        "products": [
          {
            "id": "prd_001",
            "name": "Caramel Macchiato",
            "description": "Espresso with vanilla and caramel",
            "image_url": "https://cdn.coffee-app.com/products/caramel-macchiato.jpg",
            "base_price": 4.50,
            "currency": "USD",
            "rating": 4.8,
            "total_reviews": 245,
            "is_favorite": true,
            "available": true,
            "preparation_time": 5,
            "customization_options": {
              "sizes": ["small", "medium", "large"],
              "sugar_levels": true,
              "ice_levels": true,
              "coffee_levels": true
            },
            "allergens": ["milk"],
            "calories": 250,
            "tags": ["popular", "sweet"]
          }
        ]
      },
      {
        "id": "cat_002",
        "name": "Hot Coffee",
        "slug": "hot_coffee",
        "display_order": 2,
        "products": [...]
      }
    ]
  }
}
```

### 3.3 Search Products

```json
GET /products/search?q=latte&store_id=store_001
Authorization: Bearer {access_token}

Query Parameters:
- q: string (required) - Search query
- store_id: string (optional) - Filter by store
- category: string (optional)
- min_price: float (optional)
- max_price: float (optional)
- page: integer (optional, default: 1)
- limit: integer (optional, default: 20)

Response: 200 OK
{
  "success": true,
  "data": [...],
  "pagination": {...}
}
```

---

## 4. PRODUCT DETAILS APIs

### 4.1 Get Product Details

```json
GET /products/{product_id}?store_id=store_001
Authorization: Bearer {access_token}

Response: 200 OK
{
  "success": true,
  "data": {
    "id": "prd_001",
    "name": "Caramel Macchiato",
    "description": "Rich espresso combined with vanilla-flavored syrup, milk, and caramel drizzle",
    "images": [
      "https://cdn.coffee-app.com/products/caramel-macchiato-1.jpg",
      "https://cdn.coffee-app.com/products/caramel-macchiato-2.jpg"
    ],
    "category": "hot_coffee",
    "base_price": 4.50,
    "currency": "USD",
    "rating": 4.8,
    "total_reviews": 245,
    "is_favorite": true,
    "available": true,
    "preparation_time": 5,
    "customization": {
      "sizes": [
        {"id": "small", "name": "Small (8oz)", "price_modifier": 0},
        {"id": "medium", "name": "Medium (12oz)", "price_modifier": 0.50},
        {"id": "large", "name": "Large (16oz)", "price_modifier": 1.00}
      ],
      "sugar_levels": [
        {"id": "no_sugar", "name": "No Sugar", "price_modifier": 0},
        {"id": "less_sugar", "name": "Less Sugar (25%)", "price_modifier": 0},
        {"id": "normal", "name": "Normal (50%)", "price_modifier": 0},
        {"id": "extra_sugar", "name": "Extra Sugar (75%)", "price_modifier": 0}
      ],
      "ice_levels": [
        {"id": "no_ice", "name": "No Ice", "price_modifier": 0},
        {"id": "less_ice", "name": "Less Ice", "price_modifier": 0},
        {"id": "normal", "name": "Normal Ice", "price_modifier": 0},
        {"id": "extra_ice", "name": "Extra Ice", "price_modifier": 0}
      ],
      "coffee_levels": [
        {"id": "single", "name": "Single Shot", "price_modifier": 0},
        {"id": "double", "name": "Double Shot", "price_modifier": 0.75},
        {"id": "triple", "name": "Triple Shot", "price_modifier": 1.50}
      ]
    },
    "add_ons": [
      {
        "id": "addon_001",
        "name": "Extra Caramel Drizzle",
        "price": 0.50,
        "available": true
      },
      {
        "id": "addon_002",
        "name": "Vanilla Syrup",
        "price": 0.50,
        "available": true
      }
    ],
    "nutritional_info": {
      "calories": 250,
      "protein": 9,
      "carbohydrates": 34,
      "fat": 7,
      "caffeine": 150
    },
    "allergens": ["milk", "soy"],
    "tags": ["popular", "sweet", "espresso-based"]
  }
}
```

---

## 5. CART APIs

### 5.1 Get Cart

```json
GET /cart
Authorization: Bearer {access_token}

Response: 200 OK
{
  "success": true,
  "data": {
    "id": "cart_001",
    "store_id": "store_001",
    "store_name": "Coffee Shop - Central Market",
    "items": [
      {
        "id": "cart_item_001",
        "product_id": "prd_001",
        "product_name": "Caramel Macchiato",
        "product_image": "https://cdn.coffee-app.com/products/caramel-macchiato.jpg",
        "quantity": 2,
        "customization": {
          "size": "medium",
          "sugar_level": "normal",
          "ice_level": "less_ice",
          "coffee_level": "double"
        },
        "add_ons": ["addon_001"],
        "unit_price": 5.75,
        "total_price": 11.50,
        "notes": "Extra hot please"
      }
    ],
    "subtotal": 11.50,
    "discount": 2.30,
    "promo_code": "GRAND20",
    "tax": 0.92,
    "total": 10.12,
    "currency": "USD",
    "estimated_pickup_time": "2025-11-08T11:30:00Z"
  }
}
```

### 5.2 Add to Cart

```json
POST /cart/items
Authorization: Bearer {access_token}
Content-Type: application/json

Request:
{
  "store_id": "store_001",
  "product_id": "prd_001",
  "quantity": 1,
  "customization": {
    "size": "medium",
    "sugar_level": "normal",
    "ice_level": "less_ice",
    "coffee_level": "double"
  },
  "add_ons": ["addon_001"],
  "notes": "Extra hot please"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "cart_item_id": "cart_item_001",
    "cart": {...} // Full cart object
  }
}
```

### 5.3 Update Cart Item

```json
PUT /cart/items/{cart_item_id}
Authorization: Bearer {access_token}
Content-Type: application/json

Request:
{
  "quantity": 3,
  "customization": {
    "size": "large",
    "sugar_level": "less_sugar",
    "ice_level": "normal",
    "coffee_level": "triple"
  },
  "notes": "Make it extra hot"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "cart": {...} // Full cart object
  }
}
```

### 5.4 Remove Cart Item

```json
DELETE /cart/items/{cart_item_id}
Authorization: Bearer {access_token}

Response: 200 OK
{
  "success": true,
  "data": {
    "cart": {...} // Updated cart
  }
}
```

### 5.5 Clear Cart

```json
DELETE /cart
Authorization: Bearer {access_token}

Response: 200 OK
{
  "success": true,
  "message": "Cart cleared successfully"
}
```

### 5.6 Apply Promo Code

```json
POST /cart/promo-code
Authorization: Bearer {access_token}
Content-Type: application/json

Request:
{
  "promo_code": "GRAND20"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "promo_code": "GRAND20",
    "discount_type": "percentage", // or "fixed_amount"
    "discount_value": 20,
    "discount_amount": 2.30,
    "cart": {...} // Updated cart with discount
  }
}
```

### 5.7 Remove Promo Code

```json
DELETE /cart/promo-code
Authorization: Bearer {access_token}

Response: 200 OK
{
  "success": true,
  "data": {
    "cart": {...} // Updated cart without discount
  }
}
```

### 5.8 Set Pickup Time

```json
POST /cart/pickup-time
Authorization: Bearer {access_token}
Content-Type: application/json

Request:
{
  "pickup_time": "2025-11-08T12:00:00Z"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "pickup_time": "2025-11-08T12:00:00Z",
    "cart": {...}
  }
}
```

---

## 6. PAYMENT & CHECKOUT APIs

### 6.1 Get Payment Methods

```json
GET /payment-methods
Authorization: Bearer {access_token}

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": "pm_aba",
      "name": "ABA Bank",
      "type": "mobile_banking",
      "logo_url": "https://cdn.coffee-app.com/payment/aba.png",
      "enabled": true,
      "fee_percentage": 0,
      "supported_currencies": ["USD", "KHR"]
    },
    {
      "id": "pm_acleda",
      "name": "ACLEDA Bank",
      "type": "mobile_banking",
      "logo_url": "https://cdn.coffee-app.com/payment/acleda.png",
      "enabled": true,
      "fee_percentage": 0,
      "supported_currencies": ["USD", "KHR"]
    },
    {
      "id": "pm_wing",
      "name": "WING",
      "type": "e_wallet",
      "logo_url": "https://cdn.coffee-app.com/payment/wing.png",
      "enabled": true,
      "fee_percentage": 1.5,
      "supported_currencies": ["USD", "KHR"]
    }
  ]
}
```

### 6.2 Create Order

```json
POST /orders
Authorization: Bearer {access_token}
Content-Type: application/json

Request:
{
  "store_id": "store_001",
  "payment_method_id": "pm_aba",
  "pickup_time": "2025-11-08T12:00:00Z",
  "promo_code": "GRAND20",
  "notes": "Please call when ready"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "order_id": "ord_001",
    "order_number": "CF-20251108-001",
    "status": "pending_payment",
    "payment_url": "https://payment.aba.com.kh/checkout?token=xyz123",
    "payment_expires_at": "2025-11-08T10:30:00Z",
    "total_amount": 10.12,
    "currency": "USD",
    "created_at": "2025-11-08T10:20:00Z"
  }
}
```

### 6.3 Confirm Payment (Webhook/Callback)

```json
POST /orders/{order_id}/confirm-payment
Authorization: Bearer {access_token}
Content-Type: application/json

Request:
{
  "payment_provider_transaction_id": "aba_txn_123456",
  "payment_status": "success"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "order_id": "ord_001",
    "status": "confirmed",
    "estimated_pickup_time": "2025-11-08T12:00:00Z"
  }
}
```

---

## 7. ORDER MANAGEMENT APIs

### 7.1 Get My Orders

```json
GET /orders?status=active&page=1&limit=10
Authorization: Bearer {access_token}

Query Parameters:
- status: string (optional) - "active", "completed", "cancelled", "all"
- page: integer (optional, default: 1)
- limit: integer (optional, default: 10)

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": "ord_001",
      "order_number": "CF-20251108-001",
      "status": "preparing", // pending_payment, confirmed, preparing, ready, picked_up, completed, cancelled
      "store": {
        "id": "store_001",
        "name": "Coffee Shop - Central Market",
        "address": "St. 110, Phnom Penh",
        "phone": "+855123456789"
      },
      "items": [
        {
          "product_name": "Caramel Macchiato",
          "quantity": 2,
          "unit_price": 5.75,
          "total_price": 11.50,
          "customization": "Medium, Normal Sugar, Less Ice, Double Shot",
          "image_url": "https://cdn.coffee-app.com/products/caramel-macchiato.jpg"
        }
      ],
      "subtotal": 11.50,
      "discount": 2.30,
      "tax": 0.92,
      "total": 10.12,
      "currency": "USD",
      "payment_method": "ABA Bank",
      "promo_code": "GRAND20",
      "pickup_time": "2025-11-08T12:00:00Z",
      "order_placed_at": "2025-11-08T10:20:00Z",
      "estimated_ready_time": "2025-11-08T11:45:00Z",
      "tracking": {
        "current_step": 2,
        "steps": [
          {"name": "Order Placed", "completed": true, "time": "2025-11-08T10:20:00Z"},
          {"name": "Payment Confirmed", "completed": true, "time": "2025-11-08T10:21:00Z"},
          {"name": "Preparing", "completed": false, "time": null},
          {"name": "Ready for Pickup", "completed": false, "time": null}
        ]
      }
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 3,
    "total_items": 25,
    "items_per_page": 10
  }
}
```

### 7.2 Get Order Details

```json
GET /orders/{order_id}
Authorization: Bearer {access_token}

Response: 200 OK
{
  "success": true,
  "data": {
    // Full order object with all details
  }
}
```

### 7.3 Cancel Order

```json
POST /orders/{order_id}/cancel
Authorization: Bearer {access_token}
Content-Type: application/json

Request:
{
  "reason": "Changed my mind",
  "cancel_reason_code": "customer_request" // customer_request, store_unavailable, etc.
}

Response: 200 OK
{
  "success": true,
  "data": {
    "order_id": "ord_001",
    "status": "cancelled",
    "refund_status": "processing",
    "estimated_refund_time": "3-5 business days"
  }
}
```

### 7.4 Rate Order

```json
POST /orders/{order_id}/rating
Authorization: Bearer {access_token}
Content-Type: application/json

Request:
{
  "rating": 5,
  "review": "Excellent coffee and fast service!",
  "product_ratings": [
    {
      "product_id": "prd_001",
      "rating": 5
    }
  ]
}

Response: 201 Created
{
  "success": true,
  "message": "Thank you for your feedback!"
}
```

---

## 8. FAVORITES APIs

### 8.1 Get Favorites

```json
GET /favorites?page=1&limit=20
Authorization: Bearer {access_token}

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": "prd_001",
      "name": "Caramel Macchiato",
      "image_url": "https://cdn.coffee-app.com/products/caramel-macchiato.jpg",
      "base_price": 4.50,
      "currency": "USD",
      "rating": 4.8,
      "available": true,
      "added_to_favorites_at": "2025-11-01T10:00:00Z"
    }
  ],
  "pagination": {...}
}
```

### 8.2 Add to Favorites

```json
POST /favorites
Authorization: Bearer {access_token}
Content-Type: application/json

Request:
{
  "product_id": "prd_001"
}

Response: 201 Created
{
  "success": true,
  "message": "Added to favorites"
}
```

### 8.3 Remove from Favorites

```json
DELETE /favorites/{product_id}
Authorization: Bearer {access_token}

Response: 200 OK
{
  "success": true,
  "message": "Removed from favorites"
}
```

---

## 9. USER PROFILE APIs

### 9.1 Get Profile

```json
GET /profile
Authorization: Bearer {access_token}

Response: 200 OK
{
  "success": true,
  "data": {
    "user_id": "usr_1234567890",
    "full_name": "John Doe",
    "email": "[user@example.com](mailto:user@example.com)",
    "phone_number": "+855123456789",
    "profile_image": "https://cdn.coffee-app.com/users/profile.jpg",
    "date_of_birth": "1990-01-15",
    "gender": "male",
    "loyalty_points": 450,
    "total_orders": 23,
    "member_since": "2024-01-15T00:00:00Z",
    "preferences": {
      "notifications_enabled": true,
      "email_notifications": true,
      "sms_notifications": false,
      "push_notifications": true,
      "language": "en",
      "currency": "USD"
    }
  }
}
```

### 9.2 Update Profile

```json
PUT /profile
Authorization: Bearer {access_token}
Content-Type: application/json

Request:
{
  "full_name": "John Updated Doe",
  "email": "[newemail@example.com](mailto:newemail@example.com)",
  "date_of_birth": "1990-01-15",
  "gender": "male"
}

Response: 200 OK
{
  "success": true,
  "data": {
    // Updated profile object
  }
}
```

### 9.3 Update Profile Image

```json
POST /profile/image
Authorization: Bearer {access_token}
Content-Type: multipart/form-data

Request:
- image: File (max 5MB, jpg/png)

Response: 200 OK
{
  "success": true,
  "data": {
    "profile_image": "https://cdn.coffee-app.com/users/new-profile.jpg"
  }
}
```

### 9.4 Update Password

```json
PUT /profile/password
Authorization: Bearer {access_token}
Content-Type: application/json

Request:
{
  "current_password": "OldPass123!",
  "new_password": "NewSecurePass123!"
}

Response: 200 OK
{
  "success": true,
  "message": "Password updated successfully"
}
```

### 9.5 Update Settings/Preferences

```json
PUT /profile/settings
Authorization: Bearer {access_token}
Content-Type: application/json

Request:
{
  "notifications_enabled": true,
  "email_notifications": false,
  "sms_notifications": true,
  "push_notifications": true,
  "language": "km", // en, km
  "currency": "KHR" // USD, KHR
}

Response: 200 OK
{
  "success": true,
  "data": {
    "preferences": {...}
  }
}
```

### 9.6 Delete Account

```json
DELETE /profile
Authorization: Bearer {access_token}
Content-Type: application/json

Request:
{
  "password": "CurrentPass123!",
  "reason": "No longer need the service",
  "feedback": "Optional feedback message"
}

Response: 200 OK
{
  "success": true,
  "message": "Account deleted successfully. We're sorry to see you go!"
}
```

---

## 10. NOTIFICATIONS APIs

### 10.1 Get Notifications

```json
GET /notifications?unread_only=false&page=1&limit=20
Authorization: Bearer {access_token}

Query Parameters:
- unread_only: boolean (optional, default: false)
- page: integer (optional, default: 1)
- limit: integer (optional, default: 20)

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": "notif_001",
      "type": "order_status", // order_status, promotion, announcement, system
      "title": "Your order is ready!",
      "message": "Order #CF-20251108-001 is ready for pickup",
      "image_url": "https://cdn.coffee-app.com/notifications/order-ready.png",
      "is_read": false,
      "created_at": "2025-11-08T11:45:00Z",
      "action_type": "order_details", // order_details, promotion, external_url
      "action_value": "ord_001", // order_id or URL
      "priority": "high" // low, medium, high
    },
    {
      "id": "notif_002",
      "type": "promotion",
      "title": "20% Off Today!",
      "message": "Use code GRAND20 for 20% off all drinks",
      "image_url": "https://cdn.coffee-app.com/notifications/promo.png",
      "is_read": true,
      "created_at": "2025-11-07T09:00:00Z",
      "action_type": "promotion",
      "action_value": "GRAND20",
      "priority": "medium"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 3,
    "total_items": 45,
    "items_per_page": 20
  },
  "unread_count": 5
}
```

### 10.2 Mark Notification as Read

```json
PUT /notifications/{notification_id}/read
Authorization: Bearer {access_token}

Response: 200 OK
{
  "success": true,
  "message": "Notification marked as read"
}
```

### 10.3 Mark All as Read

```json
PUT /notifications/read-all
Authorization: Bearer {access_token}

Response: 200 OK
{
  "success": true,
  "message": "All notifications marked as read"
}
```

### 10.4 Delete Notification

```json
DELETE /notifications/{notification_id}
Authorization: Bearer {access_token}

Response: 200 OK
{
  "success": true,
  "message": "Notification deleted"
}
```

### 10.5 Get Unread Count

```json
GET /notifications/unread-count
Authorization: Bearer {access_token}

Response: 200 OK
{
  "success": true,
  "data": {
    "unread_count": 5
  }
}
```

---

## 11. HELP & SUPPORT APIs

### 11.1 Get FAQ

```json
GET /support/faq?category=orders
Authorization: Bearer {access_token}

Query Parameters:
- category: string (optional) - "orders", "payment", "account", "general"

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": "faq_001",
      "category": "orders",
      "question": "How do I track my order?",
      "answer": "You can track your order status in the 'My Orders' section of your account. You'll receive notifications when your order status changes.",
      "helpful_count": 245,
      "order": 1
    },
    {
      "id": "faq_002",
      "category": "orders",
      "question": "Can I cancel my order?",
      "answer": "Yes, you can cancel your order before it starts being prepared. Go to your order details and tap 'Cancel Order'.",
      "helpful_count": 189,
      "order": 2
    }
  ]
}
```

### 11.2 Search FAQ

```json
GET /support/faq/search?q=cancel+order
Authorization: Bearer {access_token}

Response: 200 OK
{
  "success": true,
  "data": [...]
}
```

### 11.3 Submit Support Ticket

```json
POST /support/tickets
Authorization: Bearer {access_token}
Content-Type: application/json

Request:
{
  "subject": "Issue with payment",
  "category": "payment", // payment, order, account, technical, other
  "description": "My payment was deducted but order wasn't confirmed",
  "order_id": "ord_001", // optional
  "attachments": ["https://cdn.coffee-app.com/tickets/screenshot.jpg"] // optional
}

Response: 201 Created
{
  "success": true,
  "data": {
    "ticket_id": "tkt_001",
    "ticket_number": "SUP-20251108-001",
    "status": "open",
    "created_at": "2025-11-08T10:30:00Z",
    "estimated_response_time": "24 hours"
  }
}
```

### 11.4 Get Support Tickets

```json
GET /support/tickets?status=open
Authorization: Bearer {access_token}

Query Parameters:
- status: string (optional) - "open", "in_progress", "resolved", "closed", "all"

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": "tkt_001",
      "ticket_number": "SUP-20251108-001",
      "subject": "Issue with payment",
      "status": "in_progress",
      "category": "payment",
      "created_at": "2025-11-08T10:30:00Z",
      "last_updated": "2025-11-08T11:00:00Z",
      "unread_messages": 1
    }
  ]
}
```

### 11.5 Get Ticket Details

```json
GET /support/tickets/{ticket_id}
Authorization: Bearer {access_token}

Response: 200 OK
{
  "success": true,
  "data": {
    "id": "tkt_001",
    "ticket_number": "SUP-20251108-001",
    "subject": "Issue with payment",
    "status": "in_progress",
    "category": "payment",
    "description": "My payment was deducted but order wasn't confirmed",
    "created_at": "2025-11-08T10:30:00Z",
    "messages": [
      {
        "id": "msg_001",
        "sender": "user",
        "message": "My payment was deducted but order wasn't confirmed",
        "attachments": ["https://cdn.coffee-app.com/tickets/screenshot.jpg"],
        "created_at": "2025-11-08T10:30:00Z"
      },
      {
        "id": "msg_002",
        "sender": "support",
        "sender_name": "Sarah (Support Team)",
        "message": "Thank you for contacting us. We're looking into this issue and will update you shortly.",
        "created_at": "2025-11-08T11:00:00Z"
      }
    ]
  }
}
```

### 11.6 Reply to Ticket

```json
POST /support/tickets/{ticket_id}/messages
Authorization: Bearer {access_token}
Content-Type: application/json

Request:
{
  "message": "I've checked and the payment was successful on my bank's side",
  "attachments": ["https://cdn.coffee-app.com/tickets/bank-receipt.jpg"]
}

Response: 201 Created
{
  "success": true,
  "data": {
    "message_id": "msg_003",
    "created_at": "2025-11-08T11:15:00Z"
  }
}
```

### 11.7 Close Ticket

```json
PUT /support/tickets/{ticket_id}/close
Authorization: Bearer {access_token}

Response: 200 OK
{
  "success": true,
  "message": "Ticket closed successfully"
}
```

### 11.8 Contact Customer Service (Live Chat)

```json
POST /support/live-chat
Authorization: Bearer {access_token}
Content-Type: application/json

Request:
{
  "message": "I need help with my order",
  "order_id": "ord_001" // optional
}

Response: 201 Created
{
  "success": true,
  "data": {
    "chat_session_id": "chat_001",
    "agent_status": "connecting", // connecting, connected, queued
    "queue_position": 0,
    "estimated_wait_time": 0
  }
}
```

---

## 12. FEEDBACK APIs

### 12.1 Submit App Feedback

```json
POST /feedback
Authorization: Bearer {access_token}
Content-Type: application/json

Request:
{
  "type": "bug_report", // bug_report, feature_request, general_feedback
  "title": "App crashes when viewing menu",
  "description": "The app crashes every time I try to view the menu",
  "rating": 3, // 1-5, optional
  "device_info": {
    "os": "iOS",
    "os_version": "17.1",
    "app_version": "2.1.0",
    "device_model": "iPhone 14 Pro"
  },
  "attachments": ["https://cdn.coffee-app.com/feedback/screenshot.jpg"]
}

Response: 201 Created
{
  "success": true,
  "message": "Thank you for your feedback! We'll review it shortly."
}
```

---

## 13. LOYALTY & REWARDS APIs

### 13.1 Get Loyalty Points

```json
GET /loyalty/points
Authorization: Bearer {access_token}

Response: 200 OK
{
  "success": true,
  "data": {
    "total_points": 450,
    "points_to_next_reward": 50,
    "current_tier": "silver", // bronze, silver, gold, platinum
    "next_tier": "gold",
    "points_to_next_tier": 150,
    "lifetime_points": 1250
  }
}
```

### 13.2 Get Points History

```json
GET /loyalty/points/history?page=1&limit=20
Authorization: Bearer {access_token}

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": "pts_001",
      "type": "earned", // earned, redeemed, expired
      "amount": 50,
      "description": "Order #CF-20251108-001",
      "order_id": "ord_001",
      "created_at": "2025-11-08T12:00:00Z",
      "expires_at": "2026-11-08T12:00:00Z"
    },
    {
      "id": "pts_002",
      "type": "redeemed",
      "amount": -100,
      "description": "Redeemed free coffee",
      "reward_id": "rwd_001",
      "created_at": "2025-11-07T10:00:00Z"
    }
  ],
  "pagination": {...}
}
```

### 13.3 Get Available Rewards

```json
GET /loyalty/rewards
Authorization: Bearer {access_token}

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": "rwd_001",
      "name": "Free Regular Coffee",
      "description": "Get any regular-sized coffee for free",
      "points_required": 100,
      "image_url": "https://cdn.coffee-app.com/rewards/free-coffee.jpg",
      "available": true,
      "terms_and_conditions": "Valid for 30 days after redemption. Cannot be combined with other offers.",
      "category": "beverage"
    },
    {
      "id": "rwd_002",
      "name": "20% Off Next Order",
      "description": "Get 20% off your next order",
      "points_required": 200,
      "image_url": "https://cdn.coffee-app.com/rewards/discount.jpg",
      "available": true,
      "terms_and_conditions": "Valid for 14 days after redemption.",
      "category": "discount"
    }
  ]
}
```

### 13.4 Redeem Reward

```json
POST /loyalty/rewards/{reward_id}/redeem
Authorization: Bearer {access_token}

Response: 200 OK
{
  "success": true,
  "data": {
    "reward_redemption_id": "rdm_001",
    "reward_code": "REWARD-ABC123",
    "expires_at": "2025-12-08T23:59:59Z",
    "remaining_points": 350
  }
}
```

### 13.5 Get My Redeemed Rewards

```json
GET /loyalty/redeemed?status=active
Authorization: Bearer {access_token}

Query Parameters:
- status: string (optional) - "active", "used", "expired", "all"

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": "rdm_001",
      "reward_code": "REWARD-ABC123",
      "reward_name": "Free Regular Coffee",
      "status": "active", // active, used, expired
      "redeemed_at": "2025-11-08T10:00:00Z",
      "expires_at": "2025-12-08T23:59:59Z",
      "used_at": null
    }
  ]
}
```

---

## 14. PROMOTIONS & COUPONS APIs

### 14.1 Get Active Promotions

```json
GET /promotions?active=true
Authorization: Bearer {access_token}

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": "promo_001",
      "title": "Grand Opening Sale",
      "description": "Get 20% off on all drinks",
      "promo_code": "GRAND20",
      "discount_type": "percentage",
      "discount_value": 20,
      "min_order_amount": 5.00,
      "max_discount_amount": 10.00,
      "valid_from": "2025-11-01T00:00:00Z",
      "valid_until": "2025-11-15T23:59:59Z",
      "usage_limit_per_user": 3,
      "remaining_uses": 2,
      "applicable_products": [], // empty = all products
      "applicable_categories": [],
      "image_url": "https://cdn.coffee-app.com/promos/grand20.jpg",
      "terms_and_conditions": "Cannot be combined with other offers."
    }
  ]
}
```

### 14.2 Validate Promo Code

```json
POST /promotions/validate
Authorization: Bearer {access_token}
Content-Type: application/json

Request:
{
  "promo_code": "GRAND20",
  "cart_amount": 15.00,
  "store_id": "store_001"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "valid": true,
    "promo_code": "GRAND20",
    "discount_type": "percentage",
    "discount_value": 20,
    "discount_amount": 3.00,
    "final_amount": 12.00,
    "message": "Promo code applied successfully!"
  }
}

// Or if invalid:
Response: 400 Bad Request
{
  "success": false,
  "error": {
    "code": "PROMO_INVALID",
    "message": "This promo code has expired"
  }
}
```

---

## 15. ANALYTICS & TRACKING APIs (Optional - for business insights)

### 15.1 Track App Events

```json
POST /analytics/events
Authorization: Bearer {access_token}
Content-Type: application/json

Request:
{
  "event_type": "product_viewed", // product_viewed, add_to_cart, checkout_started, etc.
  "properties": {
    "product_id": "prd_001",
    "product_name": "Caramel Macchiato",
    "category": "hot_coffee",
    "price": 4.50
  },
  "timestamp": "2025-11-08T10:30:00Z"
}

Response: 200 OK
{
  "success": true,
  "message": "Event tracked"
}
```

---

## 16. SYSTEM APIs

### 16.1 Health Check

```json
GET /health

Response: 200 OK
{
  "success": true,
  "status": "healthy",
  "timestamp": "2025-11-08T10:30:00Z",
  "version": "2.1.0"
}
```

### 16.2 Get App Config

```json
GET /config
Authorization: Bearer {access_token}

Response: 200 OK
{
  "success": true,
  "data": {
    "min_app_version": "2.0.0",
    "latest_app_version": "2.1.0",
    "force_update": false,
    "maintenance_mode": false,
    "maintenance_message": "",
    "supported_languages": ["en", "km"],
    "supported_currencies": ["USD", "KHR"],
    "default_currency": "USD",
    "currency_exchange_rate": {
      "USD_to_KHR": 4100
    },
    "features": {
      "loyalty_program_enabled": true,
      "live_chat_enabled": true,
      "order_tracking_enabled": true
    },
    "contact_info": {
      "phone": "+855123456789",
      "email": "[support@coffee-app.com](mailto:support@coffee-app.com)",
      "facebook": "https://facebook.com/coffeeapp",
      "instagram": "https://instagram.com/coffeeapp"
    }
  }
}
```

---

## ERROR HANDLING

All API responses follow this structure:

### Success Response

```json
{  "success": true,  "data": {...},  "message": "Optional success message"}
```

### Error Response

```json
{  "success": false,  "error": {    "code": "ERROR_CODE",    "message": "Human-readable error message",    "details": {      "field": "Additional error details"    }  }}
```

### Common Error Codes

- `UNAUTHORIZED` (401): Invalid or expired token
- `FORBIDDEN` (403): User doesn’t have permission
- `NOT_FOUND` (404): Resource not found
- `VALIDATION_ERROR` (422): Invalid input data
- `RATE_LIMIT_EXCEEDED` (429): Too many requests
- `SERVER_ERROR` (500): Internal server error
- `SERVICE_UNAVAILABLE` (503): Service temporarily unavailable

### Error Response Examples

```json
// Validation Error
422 Unprocessable Entity
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "phone_number": "Invalid phone number format",
      "password": "Password must be at least 8 characters"
    }
  }
}

// Unauthorized
401 Unauthorized
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}

// Business Logic Error
400 Bad Request
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_POINTS",
    "message": "You don't have enough points to redeem this reward",
    "details": {
      "required_points": 100,
      "current_points": 50
    }
  }
}
```

---

## PAGINATION

All list endpoints support pagination with these parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

Response includes pagination metadata:

```json
{  "success": true,  "data": [...],  "pagination": {    "current_page": 1,    "total_pages": 5,    "total_items": 94,    "items_per_page": 20,    "has_next": true,    "has_previous": false  }}
```

---

## RATE LIMITING

- Authentication endpoints: 10 requests per minute
- Read endpoints (GET): 100 requests per minute
- Write endpoints (POST/PUT/DELETE): 30 requests per minute

Rate limit headers included in all responses:

```json
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1699445400
```

---

## WEBHOOKS (For real-time updates)

The app can register webhook URLs to receive real-time updates:

### Order Status Updates

```json
POST {your_webhook_url}Content-Type: application/jsonX-Webhook-Signature: sha256=...{  "event_type": "order.status_changed",  "timestamp": "2025-11-08T11:45:00Z",  "data": {    "order_id": "ord_001",    "order_number": "CF-20251108-001",    "old_status": "preparing",    "new_status": "ready",    "user_id": "usr_1234567890"  }}
```

### Payment Updates

```json
{  "event_type": "payment.completed",  "timestamp": "2025-11-08T10:21:00Z",  "data": {    "order_id": "ord_001",    "payment_method": "ABA Bank",    "amount": 10.12,    "currency": "USD",    "transaction_id": "aba_txn_123456"  }}
```