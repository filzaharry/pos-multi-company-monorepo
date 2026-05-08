import { apiRouter } from '@/lib/api/router';
import { ApiResponse } from '@/lib/types/api';
import { 
    ItemsListResponse, 
    CategoriesListResponse, 
    DeliveriesListResponse, 
    OrdersListResponse,
    PosQueryParams,
    PosItem,
    PosCategory,
    PosOrder
} from '../types';

export const posService = {
    // Items (Products in backend)
    getItems: async (companyId: number, params: PosQueryParams): Promise<ApiResponse<ItemsListResponse>> => {
        return apiRouter.get<ApiResponse<ItemsListResponse>>('/pos/products', { 
            params,
            headers: { 'X-Company-ID': companyId.toString() }
        });
    },

    getItem: async (companyId: number, id: number): Promise<ApiResponse<PosItem>> => {
        return apiRouter.get<ApiResponse<PosItem>>(`/pos/products/${id}`, {
            headers: { 'X-Company-ID': companyId.toString() }
        });
    },

    createItem: async (companyId: number, data: FormData): Promise<ApiResponse<PosItem>> => {
        return apiRouter.upload<ApiResponse<PosItem>>('/pos/products', data, {
            headers: { 'X-Company-ID': companyId.toString() }
        });
    },

    updateItem: async (companyId: number, id: number, data: FormData): Promise<ApiResponse<PosItem>> => {
        return apiRouter.uploadPut<ApiResponse<PosItem>>(`/pos/products/${id}`, data, {
            headers: { 'X-Company-ID': companyId.toString() }
        });
    },

    deleteItem: async (companyId: number, id: number): Promise<ApiResponse<void>> => {
        return apiRouter.delete<ApiResponse<void>>(`/pos/products/${id}`, {
            headers: { 'X-Company-ID': companyId.toString() }
        });
    },

    // Categories
    getCategories: async (companyId: number, params: PosQueryParams): Promise<ApiResponse<CategoriesListResponse>> => {
        return apiRouter.get<ApiResponse<CategoriesListResponse>>('/pos/categories', { 
            params,
            headers: { 'X-Company-ID': companyId.toString() }
        });
    },

    createCategory: async (companyId: number, data: Partial<PosCategory>): Promise<ApiResponse<PosCategory>> => {
        return apiRouter.post<ApiResponse<PosCategory>>('/pos/categories', data, {
            headers: { 'X-Company-ID': companyId.toString() }
        });
    },

    updateCategory: async (companyId: number, id: number, data: Partial<PosCategory>): Promise<ApiResponse<PosCategory>> => {
        return apiRouter.put<ApiResponse<PosCategory>>(`/pos/categories/${id}`, data, {
            headers: { 'X-Company-ID': companyId.toString() }
        });
    },

    deleteCategory: async (companyId: number, id: number): Promise<ApiResponse<void>> => {
        return apiRouter.delete<ApiResponse<void>>(`/pos/categories/${id}`, {
            headers: { 'X-Company-ID': companyId.toString() }
        });
    },

    // Deliveries (Shared with categories or separate? Backend doesn't have deliveries yet, using products for now or mocking)
    getDeliveries: async (companyId: number, params: PosQueryParams): Promise<ApiResponse<DeliveriesListResponse>> => {
        // Mocking deliveries as products for now since backend doesn't have it
        return apiRouter.get<ApiResponse<DeliveriesListResponse>>('/pos/products', { 
            params,
            headers: { 'X-Company-ID': companyId.toString() }
        });
    },

    // Orders
    getOrders: async (companyId: number, params: PosQueryParams): Promise<ApiResponse<OrdersListResponse>> => {
        return apiRouter.get<ApiResponse<OrdersListResponse>>('/pos/orders', { 
            params,
            headers: { 'X-Company-ID': companyId.toString() }
        });
    },

    createOrder: async (companyId: number, data: Partial<PosOrder>): Promise<ApiResponse<PosOrder>> => {
        return apiRouter.post<ApiResponse<PosOrder>>('/pos/orders', data, {
            headers: { 'X-Company-ID': companyId.toString() }
        });
    },

    updateOrder: async (companyId: number, id: number, data: { payment_status: string, notes?: string }): Promise<ApiResponse<PosOrder>> => {
        return apiRouter.put<ApiResponse<PosOrder>>(`/pos/orders/${id}`, data, {
            headers: { 'X-Company-ID': companyId.toString() }
        });
    },

    // Stats
    getStats: async (companyId: number): Promise<ApiResponse<any>> => {
        return apiRouter.get<ApiResponse<any>>('/pos/stats', {
            headers: { 'X-Company-ID': companyId.toString() }
        });
    }
};
