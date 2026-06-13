import { PosCategory, PosDelivery, PosExtra, PosItem, PosLevel, PosOrder } from '../../types';

export interface OrderItem {
    product_id: number;
    name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    level_ids: number[];
    extra_ids: number[];
    available_levels: { label: string; value: number }[];
    available_extras: { label: string; value: number }[];
}

export interface OrderingService {
    getCategories: (companyId: number) => Promise<{ items: PosCategory[] }>;
    getDeliveries: (companyId: number) => Promise<{ items: PosDelivery[] }>;
    getLevels: (companyId: number) => Promise<{ items: PosLevel[] }>;
    getExtras: (companyId: number) => Promise<{ items: PosExtra[] }>;
    getProducts: (companyId: number, categoryId?: number, search?: string, page?: number) => Promise<{ items: PosItem[] }>;
    createOrder: (companyId: number, data: Partial<PosOrder>) => Promise<any>;
}
