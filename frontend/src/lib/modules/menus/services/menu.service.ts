import { apiHandler } from '@/lib/api/handler';
import { ApiResponse } from '@/lib/types/api';
import { MenuItem } from '../../../hooks/useSidebarMenus';

export const menuService = {
    getSidebarMenus: (token: string) => {
        return apiHandler<ApiResponse<MenuItem[]>>((baseUrl) => 
            fetch(`${baseUrl}/menus/sidebar`, {
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                cache: 'no-store'
            })
        );
    }
};
