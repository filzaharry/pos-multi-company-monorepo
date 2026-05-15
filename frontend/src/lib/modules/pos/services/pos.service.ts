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
    PosOrder,
    PosDelivery,
    PosStats,
    PosLevel,
    PosExtra
} from '../types';
import { PaginationData } from '../../users/types';

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

    // Deliveries
    getDeliveries: async (companyId: number, params: PosQueryParams): Promise<ApiResponse<DeliveriesListResponse>> => {
        return apiRouter.get<ApiResponse<DeliveriesListResponse>>('/pos/deliveries', {
            params,
            headers: { 'X-Company-ID': companyId.toString() }
        });
    },

    createDelivery: async (companyId: number, data: Partial<PosDelivery>): Promise<ApiResponse<PosDelivery>> => {
        return apiRouter.post<ApiResponse<PosDelivery>>('/pos/deliveries', data, {
            headers: { 'X-Company-ID': companyId.toString() }
        });
    },

    updateDelivery: async (companyId: number, id: number, data: Partial<PosDelivery>): Promise<ApiResponse<PosDelivery>> => {
        return apiRouter.put<ApiResponse<PosDelivery>>(`/pos/deliveries/${id}`, data, {
            headers: { 'X-Company-ID': companyId.toString() }
        });
    },

    deleteDelivery: async (companyId: number, id: number): Promise<ApiResponse<void>> => {
        return apiRouter.delete<ApiResponse<void>>(`/pos/deliveries/${id}`, {
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

    updateOrder: async (companyId: number, id: number, data: { status: number, payment_status: string, notes?: string }): Promise<ApiResponse<PosOrder>> => {
        return apiRouter.put<ApiResponse<PosOrder>>(`/pos/orders/${id}`, data, {
            headers: { 'X-Company-ID': companyId.toString() }
        });
    },

    deleteOrder: async (companyId: number, id: number): Promise<ApiResponse<void>> => {
        return apiRouter.delete<ApiResponse<void>>(`/pos/orders/${id}`, {
            headers: { 'X-Company-ID': companyId.toString() }
        });
    },

    // Levels
    getLevels: async (companyId: number, params: PosQueryParams): Promise<ApiResponse<{ items: PosLevel[], pagination: PaginationData }>> => {
        return apiRouter.get<ApiResponse<{ items: PosLevel[], pagination: PaginationData }>>('/pos/levels', {
            params,
            headers: { 'X-Company-ID': companyId.toString() }
        });
    },

    createLevel: async (companyId: number, data: Partial<PosLevel>): Promise<ApiResponse<PosLevel>> => {
        return apiRouter.post<ApiResponse<PosLevel>>('/pos/levels', data, {
            headers: { 'X-Company-ID': companyId.toString() }
        });
    },

    updateLevel: async (companyId: number, id: number, data: Partial<PosLevel>): Promise<ApiResponse<PosLevel>> => {
        return apiRouter.put<ApiResponse<PosLevel>>(`/pos/levels/${id}`, data, {
            headers: { 'X-Company-ID': companyId.toString() }
        });
    },

    deleteLevel: async (companyId: number, id: number): Promise<ApiResponse<void>> => {
        return apiRouter.delete<ApiResponse<void>>(`/pos/levels/${id}`, {
            headers: { 'X-Company-ID': companyId.toString() }
        });
    },

    // Extras
    getExtras: async (companyId: number, params: PosQueryParams): Promise<ApiResponse<{ items: PosExtra[], pagination: PaginationData }>> => {
        return apiRouter.get<ApiResponse<{ items: PosExtra[], pagination: PaginationData }>>('/pos/extras', {
            params,
            headers: { 'X-Company-ID': companyId.toString() }
        });
    },

    createExtra: async (companyId: number, data: Partial<PosExtra>): Promise<ApiResponse<PosExtra>> => {
        return apiRouter.post<ApiResponse<PosExtra>>('/pos/extras', data, {
            headers: { 'X-Company-ID': companyId.toString() }
        });
    },

    updateExtra: async (companyId: number, id: number, data: Partial<PosExtra>): Promise<ApiResponse<PosExtra>> => {
        return apiRouter.put<ApiResponse<PosExtra>>(`/pos/extras/${id}`, data, {
            headers: { 'X-Company-ID': companyId.toString() }
        });
    },

    deleteExtra: async (companyId: number, id: number): Promise<ApiResponse<void>> => {
        return apiRouter.delete<ApiResponse<void>>(`/pos/extras/${id}`, {
            headers: { 'X-Company-ID': companyId.toString() }
        });
    },

    // Stats
    getStats: async (companyId: number): Promise<ApiResponse<PosStats>> => {
        return apiRouter.get<ApiResponse<PosStats>>('/pos/stats', {
            headers: { 'X-Company-ID': companyId.toString() }
        });
    }
};
