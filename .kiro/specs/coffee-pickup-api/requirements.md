# Requirements Document

## Introduction

This document outlines the requirements for a Coffee Pickup API that enables users to browse coffee items from selected store locations, customize their orders, and schedule pickups. The API is designed as a comprehensive system with JWT authentication, phone-based OTP verification, loyalty program, reviews, promotions, and support features.

## Glossary

- **System**: The Coffee Pickup API backend service
- **User**: A registered customer who can place orders
- **Store**: A physical cafe location where orders can be picked up
- **Product**: A menu item (coffee, beverage, or food) available for purchase
- **Cart**: A temporary collection of products selected by a user before checkout
- **Order**: A confirmed purchase with payment and pickup details
- **OTP**: One-Time Password sent via email for verification
- **JWT**: JSON Web Token used for authentication
- **Promo Code**: A discount code that can be applied to orders
- **Loyalty Points**: Rewards points earned from purchases
- **Add-on**: Extra items that can be added to products (syrups, toppings, etc.)

## Requirements

### Requirement 1: User Authentication & Registration

**User Story:** As a user, I want to register and login securely using my email with OTP verification, so that I can place orders and track my order history.

#### Acceptance Criteria

1. WHEN a user submits registration details (email, password, full_name, optional phone_number, optional referral_code) THEN THE System SHALL create a new user account with encrypted password
2. WHEN a user attempts to register with an existing email THEN THE System SHALL return an error indicating the email is already in use
3. WHEN a user registers THEN THE System SHALL generate a unique referral code for the user
4. WHEN a user registers with a referral code THEN THE System SHALL link the user to the referrer
5. WHEN a user submits valid login credentials (email and password) THEN THE System SHALL return JWT access token and refresh token
6. WHEN a user submits invalid login credentials THEN THE System SHALL return an authentication error
7. WHEN a user includes a valid JWT token in request headers THEN THE System SHALL authenticate the request and allow access to protected endpoints
8. WHEN a user includes an invalid or expired JWT token THEN THE System SHALL return an unauthorized error
9. WHEN a user's refresh token is valid THEN THE System SHALL issue a new access token
10. WHEN a user logs out THEN THE System SHALL revoke the refresh token

### Requirement 2: Email OTP Verification

**User Story:** As a user, I want to verify my email address using OTP sent via email, so that my account is secure and verified.

#### Acceptance Criteria

1. WHEN a user requests OTP for registration/verification THEN THE System SHALL generate a 6-digit OTP code and send it to the email address
2. WHEN a user submits the correct OTP within expiration time THEN THE System SHALL mark the verification as successful
3. WHEN a user submits an incorrect OTP THEN THE System SHALL increment the attempt counter and return an error
4. WHEN a user exceeds maximum OTP attempts (5) THEN THE System SHALL block further attempts and require a new OTP request
5. WHEN an OTP expires (after 10 minutes) THEN THE System SHALL reject verification attempts with that OTP
6. WHEN a user successfully verifies email THEN THE System SHALL update email_verified status to true
7. WHEN a user requests password reset THEN THE System SHALL send OTP via email for verification before allowing password change

### Requirement 3: User Profile Management

**User Story:** As a user, I want to manage my profile information and preferences, so that I can personalize my experience.

#### Acceptance Criteria

1. WHEN a user views their profile THEN THE System SHALL return user details (full_name, email, phone_number, profile_image, loyalty_points, loyalty_tier, total_orders, total_spent)
2. WHEN a user updates profile information THEN THE System SHALL validate and save the changes
3. WHEN a user updates email THEN THE System SHALL require email verification via OTP
4. WHEN a user updates password THEN THE System SHALL require current password verification and hash the new password
5. WHEN a user updates preferences THEN THE System SHALL save notification settings, language, and currency preferences
6. WHEN a user views their referral code THEN THE System SHALL display the code and referral statistics
7. WHEN a user's account status is suspended or deleted THEN THE System SHALL restrict access to protected endpoints

### Requirement 4: Store Location Management

**User Story:** As a user, I want to view available store locations with detailed information, so that I can select where to pick up my order.

#### Acceptance Criteria

1. WHEN a user requests the list of store locations THEN THE System SHALL return all active store locations with details (name, address, phone, email, coordinates, opening_hours, features, rating, average_prep_time)
2. WHEN a user requests store locations with coordinates THEN THE System SHALL support filtering by distance from user location
3. WHEN a user requests a specific store location by ID or slug THEN THE System SHALL return complete store details including special hours for holidays
4. IF a store location is marked as inactive THEN THE System SHALL NOT include it in the list of available locations
5. WHEN a user requests store locations THEN THE System SHALL include current operating status (is_open) based on current time and operating hours
6. WHEN a store has special hours (holidays) THEN THE System SHALL use special hours instead of regular operating hours
7. WHEN displaying store features THEN THE System SHALL include parking, wifi, outdoor_seating, and drive_through availability

### Requirement 5: Category Management

**User Story:** As a user, I want to browse products by category, so that I can easily find what I'm looking for.

#### Acceptance Criteria

1. WHEN a user requests categories THEN THE System SHALL return all active categories with name, description, image_url, icon, and display_order
2. WHEN categories have parent-child relationships THEN THE System SHALL support hierarchical category structure
3. WHEN displaying categories THEN THE System SHALL order them by display_order field
4. IF a category is marked as inactive THEN THE System SHALL NOT include it in the list

### Requirement 6: Product Menu Management

**User Story:** As a user, I want to browse coffee products available at my selected store with detailed information, so that I can choose what to order.

#### Acceptance Criteria

1. WHEN a user requests products for a specific store THEN THE System SHALL return available products based on store_inventory
2. WHEN a user requests products THEN THE System SHALL return details (name, description, base_price, images, category, preparation_time, calories, rating, allergens, nutritional_info)
3. WHEN a user requests a specific product by ID or slug THEN THE System SHALL return complete product details including customization options and available add-ons
4. WHEN displaying products THEN THE System SHALL support filtering by category, is_featured, is_best_selling, and tags
5. IF a product is marked as unavailable or out of stock at a store THEN THE System SHALL indicate its unavailability status
6. WHEN a product has allergen information THEN THE System SHALL display allergen warnings
7. WHEN displaying products THEN THE System SHALL include rating and total_reviews count

### Requirement 7: Product Customization

**User Story:** As a user, I want to customize my coffee order with options like size, sugar level, ice level, and coffee strength, so that I get exactly what I want.

#### Acceptance Criteria

1. WHEN a user views a product THEN THE System SHALL display available customization options (size, sugar_level, ice_level, coffee_level)
2. WHEN a customization option is required THEN THE System SHALL enforce selection before adding to cart
3. WHEN a user selects customization options THEN THE System SHALL display price modifiers for each choice
4. WHEN a customization has a default option THEN THE System SHALL pre-select it
5. WHEN displaying customization options THEN THE System SHALL order them by display_order field
6. WHEN calculating item price THEN THE System SHALL add price modifiers from selected customizations to base price

### Requirement 8: Add-ons Management

**User Story:** As a user, I want to add extra items like syrups, toppings, or extra shots to my order, so that I can enhance my drink.

#### Acceptance Criteria

1. WHEN a user views a product THEN THE System SHALL display available add-ons (syrups, toppings, extra shots, desserts)
2. WHEN a user selects add-ons THEN THE System SHALL add their prices to the item total
3. WHEN an add-on is marked as unavailable THEN THE System SHALL NOT allow selection
4. WHEN a product has default add-ons THEN THE System SHALL pre-select them
5. WHEN displaying add-ons THEN THE System SHALL group them by category

### Requirement 9: Shopping Cart Management

**User Story:** As a user, I want to add items to my cart and modify them before checkout, so that I can review and adjust my order.

#### Acceptance Criteria

1. WHEN an authenticated user adds an item to cart THEN THE System SHALL store the item with customizations, add-ons, quantity, and notes
2. WHEN a user views their cart THEN THE System SHALL return all cart items with unit_price, total_price, subtotal, discount, tax, and total
3. WHEN a user updates the quantity of a cart item THEN THE System SHALL update the item and recalculate all totals
4. WHEN a user removes an item from cart THEN THE System SHALL delete the item and recalculate totals
5. WHEN a user clears their cart THEN THE System SHALL remove all items from the cart
6. IF a user's cart contains items from multiple store locations THEN THE System SHALL clear existing items and start fresh with new store
7. WHEN a user applies a promo code THEN THE System SHALL validate and apply the discount
8. WHEN a user selects a pickup time THEN THE System SHALL store it in the cart
9. WHEN a cart is inactive for extended period THEN THE System SHALL mark it as abandoned and set expires_at
10. WHEN a user has an active cart THEN THE System SHALL maintain only one active cart per user

### Requirement 10: Pickup Time Selection

**User Story:** As a user, I want to select a pickup time for my order, so that I can collect it when convenient.

#### Acceptance Criteria

1. WHEN a user requests available pickup times for a store THEN THE System SHALL return time slots based on store operating hours
2. WHEN a user selects a pickup time THEN THE System SHALL validate that the time is at least 15 minutes in the future
3. WHEN a user selects a pickup time THEN THE System SHALL validate that the time falls within store operating hours
4. IF a user selects a pickup time outside operating hours THEN THE System SHALL return a validation error
5. WHEN generating pickup time slots THEN THE System SHALL offer slots in 15-minute intervals

### Requirement 11: Order Placement

**User Story:** As a user, I want to place my order with multiple payment options, so that I can confirm my coffee pickup.

#### Acceptance Criteria

1. WHEN a user submits an order THEN THE System SHALL validate that the cart is not empty
2. WHEN a user submits an order THEN THE System SHALL validate that a pickup time is selected and at least 15 minutes in future
3. WHEN a user submits an order THEN THE System SHALL validate that a store location is selected
4. WHEN a user places an order THEN THE System SHALL support payment methods (aba, acleda, wing, cash)
5. WHEN a user places an order THEN THE System SHALL create an order record with status "pending_payment" and payment_status "pending"
6. WHEN payment is processed successfully THEN THE System SHALL update order status to "confirmed" and payment_status to "completed"
7. WHEN an order is successfully created THEN THE System SHALL generate a unique order_number (e.g., "CF-20251108-001")
8. WHEN an order is created THEN THE System SHALL calculate subtotal, discount, tax, and total
9. WHEN an order is created THEN THE System SHALL apply promo code discount if valid
10. WHEN an order is created THEN THE System SHALL deduct loyalty points if used
11. WHEN an order is created THEN THE System SHALL award loyalty points based on order total
12. WHEN an order is successfully placed THEN THE System SHALL clear the user's cart and mark it as "checked_out"
13. WHEN an order is created THEN THE System SHALL set estimated_ready_time based on store's average_prep_time
14. WHEN an order is created THEN THE System SHALL create initial order status history entry

### Requirement 12: Order Management & Tracking

**User Story:** As a user, I want to view my order history, track current orders, and manage order status, so that I can monitor my pickups.

#### Acceptance Criteria

1. WHEN an authenticated user requests their orders THEN THE System SHALL return all orders sorted by creation date (newest first)
2. WHEN a user requests a specific order by ID or order_number THEN THE System SHALL return complete order details including items, customizations, status, payment info, and pickup information
3. WHEN displaying orders THEN THE System SHALL include order status (pending_payment, confirmed, preparing, ready, picked_up, completed, cancelled)
4. WHEN displaying orders THEN THE System SHALL include payment_status (pending, processing, completed, failed, refunded)
5. IF a user requests an order that doesn't belong to them THEN THE System SHALL return an authorization error
6. WHEN a user views order history THEN THE System SHALL support filtering by status and date range
7. WHEN an order status changes THEN THE System SHALL create an entry in order_status_history
8. WHEN a user cancels an order THEN THE System SHALL update status to "cancelled", record cancellation_reason, and process refund if applicable
9. WHEN an order is ready for pickup THEN THE System SHALL update status to "ready" and set actual_ready_time
10. WHEN a user picks up an order THEN THE System SHALL update status to "picked_up" and set picked_up_at timestamp
11. WHEN viewing order details THEN THE System SHALL include order status history with timestamps

### Requirement 13: Promo Codes & Discounts

**User Story:** As a user, I want to apply promo codes to my orders, so that I can get discounts and special offers.

#### Acceptance Criteria

1. WHEN a user applies a promo code THEN THE System SHALL validate the code exists and is active
2. WHEN validating a promo code THEN THE System SHALL check valid_from and valid_until dates
3. WHEN validating a promo code THEN THE System SHALL check usage limits (total and per user)
4. WHEN validating a promo code THEN THE System SHALL check minimum order amount requirement
5. WHEN validating a promo code THEN THE System SHALL check user loyalty tier requirement
6. WHEN validating a promo code THEN THE System SHALL check applicable products, categories, and stores
7. WHEN a promo code is applied THEN THE System SHALL calculate discount based on discount_type (percentage, fixed_amount, free_delivery)
8. WHEN a percentage discount is applied THEN THE System SHALL respect max_discount_amount if set
9. WHEN an order is placed with a promo code THEN THE System SHALL increment usage_count and create promo_code_usage record
10. WHEN a user views available promos THEN THE System SHALL return active promo codes they are eligible for

### Requirement 14: Loyalty Program

**User Story:** As a user, I want to earn and redeem loyalty points, so that I can get rewards for my purchases.

#### Acceptance Criteria

1. WHEN a user completes an order THEN THE System SHALL award loyalty points based on order total
2. WHEN loyalty points are earned or redeemed THEN THE System SHALL create a loyalty_point_transaction record
3. WHEN a user views their profile THEN THE System SHALL display current loyalty_points and loyalty_tier
4. WHEN a user's total points reach tier thresholds THEN THE System SHALL update loyalty_tier (bronze, silver, gold, platinum)
5. WHEN a user redeems points for a reward THEN THE System SHALL deduct points and create reward_redemption record
6. WHEN a user views available rewards THEN THE System SHALL return rewards they have enough points for
7. WHEN loyalty points expire THEN THE System SHALL create expiration transaction and update balance
8. WHEN a user views loyalty history THEN THE System SHALL return all loyalty_point_transactions with descriptions

### Requirement 15: Rewards System

**User Story:** As a user, I want to redeem my loyalty points for rewards, so that I can get free products or discounts.

#### Acceptance Criteria

1. WHEN a user views available rewards THEN THE System SHALL return active rewards with points_required, description, and reward_type
2. WHEN a user redeems a reward THEN THE System SHALL validate they have sufficient loyalty points
3. WHEN a reward is redeemed THEN THE System SHALL generate a unique reward_code
4. WHEN a reward is redeemed THEN THE System SHALL set expiration date based on validity_days
5. WHEN a user applies a reward to an order THEN THE System SHALL validate the reward_code is active and not expired
6. WHEN a reward is used in an order THEN THE System SHALL update reward_redemption status to "used" and set used_at timestamp
7. WHEN a reward expires unused THEN THE System SHALL update status to "expired"
8. WHEN displaying rewards THEN THE System SHALL organize by category (beverage, food, discount, merchandise)

### Requirement 16: Favorites Management

**User Story:** As a user, I want to save my favorite products, so that I can quickly reorder them.

#### Acceptance Criteria

1. WHEN a user adds a product to favorites THEN THE System SHALL create a favorite record
2. WHEN a user removes a product from favorites THEN THE System SHALL delete the favorite record
3. WHEN a user views their favorites THEN THE System SHALL return all favorited products with current details
4. WHEN a user attempts to add a duplicate favorite THEN THE System SHALL return an error
5. WHEN displaying products THEN THE System SHALL indicate if the product is in user's favorites

### Requirement 17: Reviews & Ratings

**User Story:** As a user, I want to review and rate my orders, so that I can share my experience and help other customers.

#### Acceptance Criteria

1. WHEN a user completes an order THEN THE System SHALL allow them to submit a review
2. WHEN a user submits a review THEN THE System SHALL require a rating (1-5 stars) and optional review text
3. WHEN a user submits a review THEN THE System SHALL allow uploading images
4. WHEN a review is submitted THEN THE System SHALL mark it as "pending" for moderation
5. WHEN a review is approved THEN THE System SHALL update product and store ratings
6. WHEN a user views reviews THEN THE System SHALL display verified purchase badge for order-based reviews
7. WHEN users find a review helpful THEN THE System SHALL increment helpful_count
8. WHEN a user attempts to review the same order twice THEN THE System SHALL return an error
9. WHEN displaying reviews THEN THE System SHALL support filtering by rating and sorting by date or helpfulness

### Requirement 18: Notifications

**User Story:** As a user, I want to receive notifications about my orders and promotions, so that I stay informed.

#### Acceptance Criteria

1. WHEN an order status changes THEN THE System SHALL create a notification for the user
2. WHEN a new promotion is available THEN THE System SHALL create a notification for eligible users
3. WHEN a user views notifications THEN THE System SHALL return unread and read notifications sorted by date
4. WHEN a user opens a notification THEN THE System SHALL mark it as read and set read_at timestamp
5. WHEN a notification has an action THEN THE System SHALL include action_type and action_value for deep linking
6. WHEN creating notifications THEN THE System SHALL respect user's notification preferences
7. WHEN a user has push notifications enabled THEN THE System SHALL send push notifications via FCM

### Requirement 19: Announcements

**User Story:** As a user, I want to see important announcements and promotions, so that I don't miss special offers.

#### Acceptance Criteria

1. WHEN a user opens the app THEN THE System SHALL return active announcements within date range
2. WHEN displaying announcements THEN THE System SHALL order by priority
3. WHEN an announcement has target audience THEN THE System SHALL filter by user tier or status
4. WHEN a user views an announcement THEN THE System SHALL increment view_count
5. WHEN a user clicks an announcement action THEN THE System SHALL increment click_count
6. WHEN an announcement has an action THEN THE System SHALL support promo_code, deep_link, or external_url actions

### Requirement 20: Support System

**User Story:** As a user, I want to contact support for help with my orders or account, so that I can resolve issues.

#### Acceptance Criteria

1. WHEN a user creates a support ticket THEN THE System SHALL generate a unique ticket_number
2. WHEN creating a ticket THEN THE System SHALL require subject, category, and description
3. WHEN a ticket is created THEN THE System SHALL set status to "open" and priority based on category
4. WHEN a user views their tickets THEN THE System SHALL return all tickets sorted by creation date
5. WHEN a user views a specific ticket THEN THE System SHALL return ticket details and all messages
6. WHEN a user or support staff sends a message THEN THE System SHALL create a support_message record
7. WHEN a ticket is resolved THEN THE System SHALL update status to "resolved" and set resolved_at timestamp
8. WHEN displaying tickets THEN THE System SHALL support filtering by status and category

### Requirement 21: FAQ Management

**User Story:** As a user, I want to browse frequently asked questions, so that I can find answers quickly without contacting support.

#### Acceptance Criteria

1. WHEN a user views FAQs THEN THE System SHALL return active FAQs organized by category
2. WHEN displaying FAQs THEN THE System SHALL order by display_order within each category
3. WHEN a user finds an FAQ helpful THEN THE System SHALL increment helpful_count
4. WHEN a user finds an FAQ not helpful THEN THE System SHALL increment not_helpful_count
5. WHEN displaying FAQs THEN THE System SHALL support categories (orders, payment, account, general)

### Requirement 22: Feedback System

**User Story:** As a user, I want to submit feedback about the app, so that I can help improve the service.

#### Acceptance Criteria

1. WHEN a user submits feedback THEN THE System SHALL require type (bug_report, feature_request, general_feedback)
2. WHEN submitting feedback THEN THE System SHALL capture device_info automatically
3. WHEN submitting feedback THEN THE System SHALL allow optional rating and attachments
4. WHEN feedback is submitted THEN THE System SHALL set status to "new"
5. WHEN a user views their feedback history THEN THE System SHALL return all submitted feedback with current status

### Requirement 23: Device Management

**User Story:** As a user, I want my devices to be registered for push notifications, so that I receive timely updates.

#### Acceptance Criteria

1. WHEN a user logs in on a device THEN THE System SHALL register the FCM token
2. WHEN a device token already exists THEN THE System SHALL update last_used_at timestamp
3. WHEN a user logs out THEN THE System SHALL mark the device token as inactive
4. WHEN sending push notifications THEN THE System SHALL use active device tokens only
5. WHEN a device token is invalid THEN THE System SHALL mark it as inactive

### Requirement 24: Store Inventory Management

**User Story:** As a store manager, I want to manage product availability at my store, so that customers only see available items.

#### Acceptance Criteria

1. WHEN viewing store inventory THEN THE System SHALL show all products with availability status
2. WHEN a product is out of stock THEN THE System SHALL allow setting out_of_stock_until timestamp
3. WHEN a product becomes available again THEN THE System SHALL update is_available to true
4. WHEN customers browse menu THEN THE System SHALL only show available products at selected store
5. WHEN a product is temporarily unavailable THEN THE System SHALL automatically restore availability after out_of_stock_until time

### Requirement 25: Analytics & Tracking

**User Story:** As a business owner, I want to track user behavior and events, so that I can understand usage patterns and improve the service.

#### Acceptance Criteria

1. WHEN a user performs an action THEN THE System SHALL log an analytics_event
2. WHEN logging events THEN THE System SHALL capture event_type, properties, device_info, and session_id
3. WHEN logging events THEN THE System SHALL support anonymous events (user_id nullable)
4. WHEN storing analytics THEN THE System SHALL partition data by month for performance
5. WHEN querying analytics THEN THE System SHALL support filtering by event_type, user_id, and date range

### Requirement 26: Data Validation and Error Handling

**User Story:** As a user, I want clear error messages when something goes wrong, so that I can correct my input and complete my order.

#### Acceptance Criteria

1. WHEN a user submits invalid data THEN THE System SHALL return a 422 error with specific validation messages
2. WHEN a user attempts to access a non-existent resource THEN THE System SHALL return a 404 error
3. WHEN a user attempts to access protected resources without authentication THEN THE System SHALL return a 401 error
4. WHEN a server error occurs THEN THE System SHALL return a 500 error with a generic message (without exposing internal details)
5. WHEN validation fails THEN THE System SHALL return all validation errors in a structured format

### Requirement 27: API Performance and Security

**User Story:** As a user, I want the API to be fast and secure, so that I have a smooth ordering experience and my data is protected.

#### Acceptance Criteria

1. WHEN any API endpoint is called THEN THE System SHALL respond within 2 seconds under normal load
2. WHEN storing user passwords THEN THE System SHALL use bcrypt hashing with appropriate salt rounds
3. WHEN generating JWT tokens THEN THE System SHALL include user ID and set appropriate expiration time
4. WHEN receiving requests THEN THE System SHALL validate and sanitize all input data
5. WHEN handling CORS THEN THE System SHALL configure appropriate origins for the frontend application
6. WHEN logging errors THEN THE System SHALL NOT log sensitive information (passwords, tokens)
7. WHEN rate limiting is applied THEN THE System SHALL enforce limits per endpoint type (auth: 10/min, read: 100/min, write: 30/min)
