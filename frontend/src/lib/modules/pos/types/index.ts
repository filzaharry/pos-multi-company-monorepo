import { Company } from './users/types';

export interface PosCategory {
    id: number;
    company_id: number;
    name: string;
    description?: string;
    sort_order: number;
    created_at?: string;
}

export interface PosProduct {
    id: number;
    company_id: number;
    category_id: number;
    name: string;
    sku?: string;
    description?: string;
    price: number;
    cost_price?: number;
    stock_quantity: number;
    image_url?: string;
    is_available: boolean;
    created_at?: string;
    category?: PosCategory;
}

export interface PosOrderItem {
    id?: number;
    order_id?: number;
    product_id: number;
    quantity: number;
    unit_price: number;
    subtotal: number;
    product?: PosProduct;
}

export interface PosOrder {
    id: number;
    company_id: number;
    user_id: number;
    customer_name?: string;
    total_amount: number;
    tax_amount: number;
    discount_amount: number;
    payment_method: string;
    payment_status: 'paid' | 'pending' | 'refunded';
    notes?: string;
    order_items: PosOrderItem[];
    created_at?: string;
}

export interface DashboardStats {
    total_revenue: number;
    total_orders: number;
    total_sales: number;
    low_stock: number;
}
