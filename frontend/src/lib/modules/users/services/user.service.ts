import { apiRouter } from '@/lib/api/router';
import { ApiResponse } from '@/lib/types/api';
import { User } from '../../login/types';
import { UserListResponse, Role, Company, UserPayload, RoleListResponse, RolePayload, Permission } from '../types';

export const userService = {
    getUsers: async (params: { 
        page?: number; 
        limit?: number; 
        search?: string; 
        role_id?: string; 
        company_id?: string; 
        sort_key?: string; 
        sort_order?: string;
        start_date?: string;
        end_date?: string;
    }): Promise<ApiResponse<UserListResponse>> => {
        const query = new URLSearchParams();
        if (params.page) query.append('page', params.page.toString());
        if (params.limit) query.append('limit', params.limit.toString());
        if (params.search) query.append('search', params.search);
        if (params.role_id) query.append('role_id', params.role_id);
        if (params.company_id) query.append('company_id', params.company_id);
        if (params.sort_key) query.append('sort_key', params.sort_key);
        if (params.sort_order) query.append('sort_order', params.sort_order);
        if (params.start_date) query.append('start_date', params.start_date);
        if (params.end_date) query.append('end_date', params.end_date);

        return apiRouter.get<ApiResponse<UserListResponse>>(`/users?${query.toString()}`);
    },

    createUser: async (data: UserPayload): Promise<ApiResponse<User>> => {
        return apiRouter.post<ApiResponse<User>>('/users', data);
    },

    updateUser: async (id: number, data: UserPayload): Promise<ApiResponse<User>> => {
        return apiRouter.put<ApiResponse<User>>(`/users/${id}`, data);
    },

    deleteUser: async (id: number): Promise<ApiResponse<null>> => {
        return apiRouter.delete<ApiResponse<null>>(`/users/${id}`);
    },

    // Roles Management
    getRoles: async (): Promise<ApiResponse<Role[]>> => {
        return apiRouter.get<ApiResponse<Role[]>>('/roles/all');
    },

    getRolesPaginated: async (params: { 
        page?: number; 
        limit?: number; 
        search?: string; 
        sort_key?: string; 
        sort_order?: string;
        start_date?: string;
        end_date?: string;
    }): Promise<ApiResponse<RoleListResponse>> => {
        const query = new URLSearchParams();
        if (params.page) query.append('page', params.page.toString());
        if (params.limit) query.append('limit', params.limit.toString());
        if (params.search) query.append('search', params.search);
        if (params.sort_key) query.append('sort_key', params.sort_key);
        if (params.sort_order) query.append('sort_order', params.sort_order);
        if (params.start_date) query.append('start_date', params.start_date);
        if (params.end_date) query.append('end_date', params.end_date);

        return apiRouter.get<ApiResponse<RoleListResponse>>(`/roles?${query.toString()}`);
    },

    createRole: async (data: RolePayload): Promise<ApiResponse<Role>> => {
        return apiRouter.post<ApiResponse<Role>>('/roles', data);
    },

    updateRole: async (id: number, data: RolePayload): Promise<ApiResponse<Role>> => {
        return apiRouter.put<ApiResponse<Role>>(`/roles/${id}`, data);
    },

    deleteRole: async (id: number): Promise<ApiResponse<null>> => {
        return apiRouter.delete<ApiResponse<null>>(`/roles/${id}`);
    },

    updateRolePermissions: async (id: number, permissionIds: number[]): Promise<ApiResponse<null>> => {
        return apiRouter.put<ApiResponse<null>>(`/roles/${id}/permissions`, { permission_ids: permissionIds });
    },

    getPermissions: async (): Promise<ApiResponse<Permission[]>> => {
        return apiRouter.get<ApiResponse<Permission[]>>('/permissions');
    },

    getRolesWithPermissions: async (): Promise<ApiResponse<Role[]>> => {
        return apiRouter.get<ApiResponse<Role[]>>('/roles/permissions');
    },

    getCompanies: async (): Promise<ApiResponse<Company[]>> => {
        return apiRouter.get<ApiResponse<Company[]>>('/companies');
    }
};
