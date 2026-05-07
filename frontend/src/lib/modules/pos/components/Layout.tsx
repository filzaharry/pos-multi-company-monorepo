import React, { useState, useEffect, useCallback } from 'react';
import { useLogin } from '@/lib/modules/login/store/useLogin';
import { userService } from '@/lib/modules/users/services/user.service';
import { LookupOption } from '@/lib/modules/users/types';
import { CustomTabs } from '@/components/ui/tabs/CustomTabs';
import { Package, Tags, Truck, ShoppingCart, Building2, ChevronDown, AlertCircle } from 'lucide-react';
import { ItemsTab } from './tabs/ItemsTab';
import { CategoriesTab } from './tabs/CategoriesTab';
import { DeliveriesTab } from './tabs/DeliveriesTab';
import { OrdersTab } from './tabs/OrdersTab';
import { motion, AnimatePresence } from 'framer-motion';

export const Layout = () => {
    const { user: currentUser, activeCompanyId, setActiveCompanyId } = useLogin();
    const [companies, setCompanies] = useState<LookupOption[]>([]);
    const [activeTab, setActiveTab] = useState('items');
    const [isLoading, setIsLoading] = useState(false);

    const isSuperAdmin = currentUser?.role?.name === 'Super Admin';

    const fetchCompanies = useCallback(async () => {
        if (!isSuperAdmin) return;
        try {
            const response = await userService.getCompanyOptions();
            if (response.status === 'success' || response.status === 'Success') {
                setCompanies(response.data.result);
            }
        } catch (error) {
            console.error('Failed to fetch companies:', error);
        }
    }, [isSuperAdmin]);

    useEffect(() => {
        fetchCompanies();
    }, [fetchCompanies]);

    // Handle initial company selection for non-super admins
    useEffect(() => {
        if (!isSuperAdmin && currentUser?.company_id && !activeCompanyId) {
            setActiveCompanyId(currentUser.company_id);
        }
    }, [currentUser, isSuperAdmin, activeCompanyId, setActiveCompanyId]);

    const tabs = [
        { id: 'items', label: 'Items', icon: Package },
        { id: 'categories', label: 'Categories', icon: Tags },
        { id: 'deliveries', label: 'Deliveries', icon: Truck },
        { id: 'orders', label: 'Orders', icon: ShoppingCart },
    ];

    const renderTabContent = () => {
        if (!activeCompanyId) return null;

        switch (activeTab) {
            case 'items': return <ItemsTab companyId={activeCompanyId} />;
            case 'categories': return <CategoriesTab companyId={activeCompanyId} />;
            case 'deliveries': return <DeliveriesTab companyId={activeCompanyId} />;
            case 'orders': return <OrdersTab companyId={activeCompanyId} />;
            default: return null;
        }
    };

    return (
        <div className="space-y-8 p-6 lg:p-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner border border-primary/20">
                            <ShoppingCart className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Point of Sale</h1>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">Management Console</p>
                        </div>
                    </div>
                </div>

                {/* Company Selector */}
                <div className="w-full md:w-80">
                    <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 block px-1">Selected Company</label>
                    <div className="relative group">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                        <select
                            value={activeCompanyId || ''}
                            onChange={(e) => setActiveCompanyId(Number(e.target.value))}
                            disabled={!isSuperAdmin}
                            className="w-full pl-11 pr-10 py-3 bg-background-dark/50 border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all appearance-none disabled:opacity-60 disabled:cursor-not-allowed shadow-xl"
                        >
                            {!activeCompanyId && <option value="">Select a company to manage</option>}
                            {isSuperAdmin ? (
                                companies.map(c => (
                                    <option key={c.value} value={c.value}>{c.label}</option>
                                ))
                            ) : (
                                currentUser?.company && (
                                    <option value={currentUser.company_id}>{currentUser.company.name}</option>
                                )
                            )}
                        </select>
                        {isSuperAdmin && <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />}
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeCompanyId ? (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-8"
                    >
                        <CustomTabs 
                            tabs={tabs} 
                            activeTab={activeTab} 
                            onChange={setActiveTab} 
                        />
                        
                        <div className="bg-background-dark/30 rounded-[2.5rem] border border-white/5 p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 blur-[100px] -z-10" />
                            
                            {renderTabContent()}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-32 flex flex-col items-center justify-center text-center space-y-4"
                    >
                        <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-gray-500 mb-4">
                            <AlertCircle className="w-10 h-10 opacity-20" />
                        </div>
                        <h2 className="text-xl font-bold text-white uppercase italic tracking-wider">No Company Selected</h2>
                        <p className="text-gray-500 max-w-xs text-sm">Please select a company from the dropdown above to manage items, categories, and orders.</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
