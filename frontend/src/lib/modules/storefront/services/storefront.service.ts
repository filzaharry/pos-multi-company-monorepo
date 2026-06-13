import { apiRouter } from '@/lib/api/router';
import { ApiResponse } from '@/lib/types/api';
import { PosCategory, PosItem, PosOrder, PosDelivery, PosLevel, PosExtra } from '../../pos/types';

export interface StoreCompany {
    id: number;
    name: string;
    logo_url: string;
    address: string;
    phone: string;
}

export const storefrontService = {
    resolveRoute: async (route: string): Promise<ApiResponse<StoreCompany>> => {
        return apiRouter.get<ApiResponse<StoreCompany>>(`/apps/pos/resolve/${route}`);
    },

    getCategories: async (companyId: number): Promise<ApiResponse<PosCategory[]>> => {
        return apiRouter.get<ApiResponse<PosCategory[]>>(`/apps/pos/${companyId}/categories`);
    },

    getDeliveries: async (companyId: number): Promise<ApiResponse<PosDelivery[]>> => {
        return apiRouter.get<ApiResponse<PosDelivery[]>>(`/apps/pos/${companyId}/deliveries`);
    },

    getLevels: async (companyId: number, params?: any): Promise<ApiResponse<PosLevel[]>> => {
        return apiRouter.get<ApiResponse<PosLevel[]>>(`/apps/pos/${companyId}/levels`, { params });
    },

    getExtras: async (companyId: number, params?: any): Promise<ApiResponse<PosExtra[]>> => {
        return apiRouter.get<ApiResponse<PosExtra[]>>(`/apps/pos/${companyId}/extras`, { params });
    },

    getProducts: async (companyId: number, categoryId?: number, search?: string): Promise<ApiResponse<PosItem[]>> => {
        const params: Record<string, string | number> = {};
        if (categoryId) params.category_id = categoryId;
        if (search) params.search = search;
        
        return apiRouter.get<ApiResponse<PosItem[]>>(`/apps/pos/${companyId}/products`, { params });
    },

    createOrder: async (companyId: number, data: Partial<PosOrder>): Promise<ApiResponse<PosOrder>> => {
        return apiRouter.post<ApiResponse<PosOrder>>(`/apps/pos/${companyId}/orders`, data);
    }
};
