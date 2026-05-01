import { ApiResponse } from '@/lib/types/api';
import { PaginationData } from '../users/types';

export interface CompanySubsPackage {
    id: number;
    name: string;
    description: string;
    pricing: number;
    created_at: string;
    updated_at: string;
}

export interface CompanySubscription {
    id: number;
    company_id?: number;
    full_name: string;
    business_email: string;
    phone_number: string;
    company_name: string;
    package_id: number;
    payment_method: number; // 0: Bank, 1: QRIS
    payment_receipt: string;
    payment_status: number; // 0: Pending, 1: Success, 2: Failed
    start_date?: string;
    end_date?: string;
    created_at: string;
    updated_at: string;
    package: CompanySubsPackage;
    company?: {
        id: number;
        name: string;
    };
}

export interface SubscriptionListResponse {
    subscriptions: CompanySubscription[];
    pagination: PaginationData;
}

export interface SubscriptionStats {
    total_subscriptions: number;
    active_subscriptions: number;
    pending_approvals: number;
    total_revenue: number;
}

export interface SubscriptionPayload {
    full_name: string;
    business_email: string;
    phone_number: string;
    company_name: string;
    package_id: number;
    payment_method: number;
    payment_receipt?: string;
}
