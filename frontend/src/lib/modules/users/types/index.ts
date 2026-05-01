import { ApiResponse } from '@/lib/types/api';
import { User } from '../../login/types';

export interface PaginationData {
    total: number;
    page: number;
    limit: number;
    last_page: number;
    has_next: boolean;
    has_previous: boolean;
}

export interface UserListResponse {
    users: User[];
    pagination: PaginationData;
}

export interface Role {
    id: number;
    name: string;
    description?: string;
    created_at?: string;
    permissions?: Permission[];
}

export interface Permission {
    id: number;
    name: string;
    slug: string;
    group_name: string;
}

export interface RoleListResponse {
    roles: Role[];
    pagination: PaginationData;
}

export interface RolePayload {
    name: string;
    description: string;
}

export interface Company {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    logo_url?: string;
    subscription_plan: 'basic' | 'recommended' | 'expert';
    subscription_status: 'active' | 'inactive' | 'pending';
    payment_proof_url?: string;
    valid_until?: string;
    created_at?: string;
    updated_at?: string;
}

export interface UserManagementState {
    users: User[];
    pagination: PaginationData | null;
    isLoading: boolean;
    error: string | null;
}

export interface UserPayload {
    name: string;
    email: string;
    phone: string;
    password?: string;
    role_id: number;
    company_id?: number;
}
