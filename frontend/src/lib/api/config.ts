// API Configuration

export const apiConfig = {
    // Base URL for the API
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",

    // Timeout for requests (in milliseconds)
    timeout: 30000, // 30 seconds

    // Endpoints
    endpoints: {
        // Auth
        auth: {
            login: "/api/auth/login",
            register: "/api/auth/register",
            logout: "/api/auth/logout",
            refresh: "/api/auth/refresh",
            verifyEmail: "/api/auth/verify-email",
            resendVerification: "/api/auth/resend-verification",
            forgotPassword: "/api/auth/forgot-password",
            resetPassword: "/api/auth/reset-password",
            me: "/api/auth/me",
        },

        // Users
        users: {
            list: "/api/users",
            get: (id: string) => `/api/users/${id}`,
            update: (id: string) => `/api/users/${id}`,
            delete: (id: string) => `/api/users/${id}`,
            updateRole: (id: string) => `/api/users/${id}/role`,
        },

        // Products
        products: {
            list: "/api/products",
            get: (id: string) => `/api/products/${id}`,
            create: "/api/products",
            update: (id: string) => `/api/products/${id}`,
            delete: (id: string) => `/api/products/${id}`,
            toggleAvailability: (id: string) =>
                `/api/products/${id}/availability`,
        },

        // Orders
        orders: {
            list: "/api/orders",
            get: (id: string) => `/api/orders/${id}`,
            create: "/api/orders",
            update: (id: string) => `/api/orders/${id}`,
            updateStatus: (id: string) => `/api/orders/${id}/status`,
            cancel: (id: string) => `/api/orders/${id}/cancel`,
            myOrders: "/api/orders/my-orders",
        },

        // Cart
        cart: {
            get: "/api/cart",
            addItem: "/api/cart/items",
            updateItem: (itemId: string) => `/api/cart/items/${itemId}`,
            removeItem: (itemId: string) => `/api/cart/items/${itemId}`,
            clear: "/api/cart",
        },

        // Favorites
        favorites: {
            list: "/api/favorites",
            add: "/api/favorites",
            remove: (productId: string) => `/api/favorites/${productId}`,
            check: (productId: string) => `/api/favorites/${productId}/check`,
        },

        // Notifications
        notifications: {
            list: "/api/notifications",
            markAsRead: (id: string) => `/api/notifications/${id}/read`,
            markAllAsRead: "/api/notifications/read-all",
            delete: (id: string) => `/api/notifications/${id}`,
        },

        // Add-ons
        addons: {
            list: "/api/addons",
            get: (id: string) => `/api/addons/${id}`,
            create: "/api/addons",
            update: (id: string) => `/api/addons/${id}`,
            delete: (id: string) => `/api/addons/${id}`,
        },

        // Reports (Admin)
        reports: {
            dashboard: "/api/reports/dashboard",
            sales: "/api/reports/sales",
            orders: "/api/reports/orders",
            products: "/api/reports/products",
            revenue: "/api/reports/revenue",
            export: "/api/reports/export",
        },

        // Config (Admin)
        config: {
            get: "/api/config",
            update: "/api/config",
            deliveryZones: "/api/config/delivery-zones",
            createDeliveryZone: "/api/config/delivery-zones",
            updateDeliveryZone: (id: string) =>
                `/api/config/delivery-zones/${id}`,
            deleteDeliveryZone: (id: string) =>
                `/api/config/delivery-zones/${id}`,
        },

        // Support
        support: {
            tickets: "/api/support/tickets",
            createTicket: "/api/support/tickets",
            getTicket: (id: string) => `/api/support/tickets/${id}`,
            updateTicket: (id: string) => `/api/support/tickets/${id}`,
            addMessage: (id: string) => `/api/support/tickets/${id}/messages`,
        },

        // Health
        health: "/api/health",
    },

    // Retry configuration
    retry: {
        maxRetries: 3,
        retryDelay: 1000, // 1 second
        retryOnStatusCodes: [408, 429, 500, 502, 503, 504],
    },

    // Cache configuration
    cache: {
        enabled: true,
        ttl: 5 * 60 * 1000, // 5 minutes
    },
} as const;

export type ApiConfig = typeof apiConfig;
