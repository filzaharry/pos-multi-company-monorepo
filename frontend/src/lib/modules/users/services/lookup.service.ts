import { apiHandler } from '@/lib/api/handler';
import { LookupOption } from '../types';
import { ApiResponse } from '@/lib/types/api';

export const lookupService = {
    getRoleOptions: (token: string) => {
        return apiHandler<ApiResponse<LookupOption[]>>((baseUrl) =>
            fetch(`${baseUrl}/lookups/roles`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                cache: 'no-store'
            })
        );
    },
    getCompanyOptions: (token: string, search?: string) => {
        const query = new URLSearchParams();
        if (search) query.append('search', search);

        return apiHandler<ApiResponse<LookupOption[]>>((baseUrl) =>
            fetch(`${baseUrl}/lookups/companies?${query.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                cache: 'no-store'
            })
        );
    },
    getPosCategoryOptions: (token: string, companyId: number) => {
        return apiHandler<ApiResponse<LookupOption[]>>((baseUrl) =>
            fetch(`${baseUrl}/lookups/pos-categories`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'X-Company-ID': companyId.toString()
                },
                cache: 'no-store'
            })
        );
    }
};
