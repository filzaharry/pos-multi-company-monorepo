import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Desktop } from './Desktop';
import { useLogin } from '@/lib/modules/login/store/useLogin';
import { userService } from '@/lib/modules/users/services/user.service';
import { LookupOption } from '@/lib/modules/users/types';
import { Package, Tags, Truck, ShoppingCart, Layers, PlusCircle } from 'lucide-react';

export const Layout = () => {
    // Use selectors for better performance and to avoid unnecessary re-renders
    const currentUser = useLogin(state => state.user);
    const activeCompanyId = useLogin(state => state.activeCompanyId);
    const setActiveCompanyId = useLogin(state => state.setActiveCompanyId);

    const [companies, setCompanies] = useState<LookupOption[]>([]);
    const [activeTab, setActiveTab] = useState('items');

    const isSuperAdmin = currentUser?.role?.name === 'Super Admin';

    // Handle company options fetching
    useEffect(() => {
        if (!isSuperAdmin) return;

        let isMounted = true;
        const loadCompanies = async () => {
            try {
                const response = await userService.getCompanyOptions();
                if (isMounted && (response.status === 'success' || response.status === 'Success')) {
                    setCompanies(response.data.result);
                }
            } catch (error) {
                console.error('Failed to fetch companies:', error);
            }
        };

        loadCompanies();
        return () => { isMounted = false; };
    }, [isSuperAdmin]);

    // Handle initial company selection for non-super admins
    useEffect(() => {
        if (!isSuperAdmin && currentUser?.company_id && activeCompanyId === null) {
            setActiveCompanyId(currentUser.company_id);
        }
    }, [isSuperAdmin, currentUser?.company_id, activeCompanyId, setActiveCompanyId]);

    const tabs = [
        { id: 'items', label: 'Items', icon: Package },
        { id: 'categories', label: 'Categories', icon: Tags },
        { id: 'levels', label: 'Levels', icon: Layers },
        { id: 'extras', label: 'Extras', icon: PlusCircle },
        { id: 'deliveries', label: 'Deliveries', icon: Truck },
        { id: 'orders', label: 'Orders', icon: ShoppingCart },
    ];

    return (
        <DashboardLayout>
            <Desktop 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tabs={tabs}
                activeCompanyId={activeCompanyId}
                isSuperAdmin={isSuperAdmin}
                companies={companies}
                currentUser={currentUser}
                setActiveCompanyId={setActiveCompanyId}
            />
        </DashboardLayout>
    );
};
