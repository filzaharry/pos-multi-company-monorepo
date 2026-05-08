import { PaginationData } from '@/lib/modules/users/types';

export interface PosItem {
    id: number;
    company_id: number;
    category_id: number;
    product_type: number; // 0: Retail, 1: Food/Drink
    name: string;
    description?: string;
    sku: string;
    price: number;
    cost_price?: number;
    stock_quantity: number;
    track_stock: boolean;
    is_available: boolean;
    image_url?: string;
    created_at?: string;
    updated_at?: string;
    category?: PosCategory;
}

export interface PosCategory {
    id: number;
    company_id: number;
    name: string;
    description?: string;
    sort_order: number;
    created_at?: string;
    updated_at?: string;
}

export interface PosDelivery {
    id: number;
    company_id: number;
    order_id: number;
    courier_name: string;
    tracking_number?: string;
    status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
    shipped_at?: string;
    delivered_at?: string;
    created_at?: string;
}

export interface PosOrder {
    id: number;
    company_id: number;
    user_id: number;
    customer_name: string;
    total_amount: number;
    tax_amount: number;
    discount_amount: number;
    payment_method: string;
    payment_status: string; // 'Pending', 'Paid', 'Cancelled'
    notes?: string;
    created_at?: string;
    updated_at?: string;
    order_items?: PosOrderItem[];
}

export interface PosOrderItem {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    unit_price: number;
    subtotal: number;
    product?: PosItem;
}

export interface ItemsListResponse {
    items: PosItem[];
    pagination: PaginationData;
}

export interface CategoriesListResponse {
    items: PosCategory[]; // Backend returns 'items' now in SuccessResponse wrapper
    pagination: PaginationData;
}

export interface DeliveriesListResponse {
    items: PosDelivery[];
    pagination: PaginationData;
}

export interface OrdersListResponse {
    items: PosOrder[];
    pagination: PaginationData;
}

export interface PosQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    category_id?: number;
    [key: string]: string | number | boolean | undefined;
}
