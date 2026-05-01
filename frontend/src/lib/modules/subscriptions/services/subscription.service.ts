import { apiRouter } from '@/lib/api/router';
import {
    SubscriptionListResponse,
    CompanySubscription,
    SubscriptionPayload,
    SubscriptionStats,
    CompanySubsPackage
} from '../types';
import { ApiResponse } from '@/lib/types/api';

export const subscriptionService = {
    getSubscriptions: async (params: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        sort_key?: string;
        sort_order?: string;
    }): Promise<ApiResponse<SubscriptionListResponse>> => {
        const query = new URLSearchParams();
        if (params.page) query.append('page', params.page.toString());
        if (params.limit) query.append('limit', params.limit.toString());
        if (params.search) query.append('search', params.search);
        if (params.status) query.append('status', params.status);
        if (params.sort_key) query.append('sort_key', params.sort_key);
        if (params.sort_order) query.append('sort_order', params.sort_order);

        return apiRouter.get<ApiResponse<SubscriptionListResponse>>(`/subscriptions?${query.toString()}`);
    },

    getStats: async (): Promise<ApiResponse<SubscriptionStats>> => {
        return apiRouter.get<ApiResponse<SubscriptionStats>>('/subscriptions/stats');
    },

    getDetail: async (id: number): Promise<ApiResponse<CompanySubscription>> => {
        return apiRouter.get<ApiResponse<CompanySubscription>>(`/subscriptions/${id}`);
    },

    createSubscription: async (data: SubscriptionPayload): Promise<ApiResponse<CompanySubscription>> => {
        return apiRouter.post<ApiResponse<CompanySubscription>>('/subscriptions', data);
    },

    updateSubscription: async (id: number, data: Partial<SubscriptionPayload>): Promise<ApiResponse<CompanySubscription>> => {
        return apiRouter.put<ApiResponse<CompanySubscription>>(`/subscriptions/${id}`, data);
    },

    deleteSubscription: async (id: number): Promise<ApiResponse<null>> => {
        return apiRouter.delete<ApiResponse<null>>(`/subscriptions/${id}`);
    },

    approveSubscription: async (id: number): Promise<ApiResponse<null>> => {
        return apiRouter.post<ApiResponse<null>>(`/subscriptions/${id}/approve`, {});
    },

    renewSubscription: async (data: { subscription_id: number; package_id: number; payment_method: number }): Promise<ApiResponse<CompanySubscription>> => {
        return apiRouter.post<ApiResponse<CompanySubscription>>('/subscriptions/renew', data);
    },

    getPackages: async (): Promise<ApiResponse<CompanySubsPackage[]>> => {
        return apiRouter.get<ApiResponse<CompanySubsPackage[]>>('/packages');
    }
};
