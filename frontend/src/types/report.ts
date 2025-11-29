export interface DashboardStats {
    totalSales: number;
    totalOrders: number;
    totalCustomers: number;
    averageOrderValue: number;
}

export interface SalesReport {
    date: string;
    totalSales: number;
    orderCount: number;
}

export interface OrdersReport {
    status: string;
    count: number;
}

export interface ProductsReport {
    productId: string;
    productName: string;
    quantitySold: number;
    revenue: number;
}

export interface RevenueReport {
    date: string;
    revenue: number;
}
