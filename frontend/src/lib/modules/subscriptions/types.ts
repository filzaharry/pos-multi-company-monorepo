import { ApiResponse } from '@/lib/types/api';
import { PaginationData } from '../users/types';

export interface CompanySubsPackage {
    id: number;
    name: string;
    description: string;
    pricing: number;
    duration_days: number;
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
    route?: string;
    package_id: number;
    payment_method: number; // 0: Bank, 1: QRIS
    payment_receipt: string;
    payment_status: number; // 0: Pending, 1: Success, 2: Failed
    start_date?: string;
    end_date?: string;
    approved_by_id?: number;
    created_at: string;
    updated_at: string;
    package: CompanySubsPackage;
    company?: CompanyHeader;
}

// Header: represents a Company in the subscription list
export interface CompanyHeader {
    id: number;
    name: string;
    email: string;
    phone: string;
    route: string;
    status: number; // 0: Pending, 1: Active, 2: Expired
    logo_url?: string;
    banner_url?: string;
    subscription_end_date?: string;
    created_at: string;
    updated_at: string;
    subscriptions?: CompanySubscription[];
}

export interface SubscriptionListResponse {
    result: CompanyHeader[];
    pagination: PaginationData;
}

export interface SubscriptionHistoryResponse {
    result: CompanySubscription[];
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
    route?: string;
    package_id: number;
    payment_method: number;
    payment_receipt?: string;
    payment_status?: number;
    company_id?: number;
}
