import { useState, useEffect } from 'react';
import { apiRouter } from '@/lib/api/router';
import { useLogin } from '../modules/login/store/useLogin';
import { ApiResponse } from '../types/api';

export interface MenuItem {
    id: number;
    name: string;
    group_name: string;
    path: string;
    icon: string;
    type: string;
    parent_id?: number | null;
    children?: MenuItem[];
}

export const useSidebarMenus = () => {
    const [menus, setMenus] = useState<MenuItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { activeCompanyId } = useLogin();

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const res = await apiRouter.get<ApiResponse<MenuItem[]>>('/menus/sidebar');
                if (res.status === 'success' || res.status === 'Success') {
                    setMenus(res.data.result);
                }
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Failed to fetch menus');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMenus();
    }, [activeCompanyId]);

    return { menus, isLoading, error };
};
