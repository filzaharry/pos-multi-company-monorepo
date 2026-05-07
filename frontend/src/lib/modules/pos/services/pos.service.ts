import apiRouter from '@/lib/api/router';
import { ApiResponse } from '@/lib/types/api';
import { 
    ItemsListResponse, 
    CategoriesListResponse, 
    DeliveriesListResponse, 
    OrdersListResponse 
} from '../types';

export const posService = {
    // Items
    getItems: async (companyId: number, params: any): Promise<ApiResponse<ItemsListResponse>> => {
        const query = new URLSearchParams(params);
        return apiRouter.get<ApiResponse<ItemsListResponse>>(`/pos/companies/${companyId}/items?${query.toString()}`);
    },

    // Categories
    getCategories: async (companyId: number, params: any): Promise<ApiResponse<CategoriesListResponse>> => {
        const query = new URLSearchParams(params);
        return apiRouter.get<ApiResponse<CategoriesListResponse>>(`/pos/companies/${companyId}/categories?${query.toString()}`);
    },

    // Deliveries
    getDeliveries: async (companyId: number, params: any): Promise<ApiResponse<DeliveriesListResponse>> => {
        const query = new URLSearchParams(params);
        return apiRouter.get<ApiResponse<DeliveriesListResponse>>(`/pos/companies/${companyId}/deliveries?${query.toString()}`);
    },

    // Orders
    getOrders: async (companyId: number, params: any): Promise<ApiResponse<OrdersListResponse>> => {
        const query = new URLSearchParams(params);
        return apiRouter.get<ApiResponse<OrdersListResponse>>(`/pos/companies/${companyId}/orders?${query.toString()}`);
    },
};
