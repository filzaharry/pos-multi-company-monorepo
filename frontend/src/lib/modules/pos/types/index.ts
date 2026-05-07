import { PaginationData } from '@/lib/modules/users/types';

export interface PosItem {
    id: number;
    company_id: number;
    category_id: number;
    name: string;
    description?: string;
    sku: string;
    price: number;
    stock: number;
    image_url?: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
    category?: PosCategory;
}

export interface PosCategory {
    id: number;
    company_id: number;
    name: string;
    description?: string;
    is_active: boolean;
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
    total_amount: number;
    status: 'pending' | 'paid' | 'completed' | 'cancelled';
    payment_method?: string;
    created_at?: string;
}

export interface ItemsListResponse {
    items: PosItem[];
    pagination: PaginationData;
}

export interface CategoriesListResponse {
    categories: PosCategory[];
    pagination: PaginationData;
}

export interface DeliveriesListResponse {
    deliveries: PosDelivery[];
    pagination: PaginationData;
}

export interface OrdersListResponse {
    orders: PosOrder[];
    pagination: PaginationData;
}
