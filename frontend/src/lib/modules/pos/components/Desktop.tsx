import { CustomTabs } from '@/components/ui/tabs/CustomTabs';
import { User } from '@/lib/modules/login/types';
import { LookupOption } from '@/lib/modules/users/types';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import React from 'react';
import { CategoriesTab } from './tabs/categories/CategoriesTab';
import { DeliveriesTab } from './tabs/deliveries/DeliveriesTab';
import { ItemsTab } from './tabs/items/ItemsTab';
import { OrdersTab } from './tabs/orders/OrdersTab';
import { PosHeader } from './widgets/PosHeader';
import { ContentSection } from '../../content/types';

interface DesktopProps {
    activeTab: string;
    setActiveTab: (id: string) => void;
    tabs: ContentSection[];
    activeCompanyId: number | null;
    isSuperAdmin: boolean;
    companies: LookupOption[];
    currentUser: User | null;
    setActiveCompanyId: (id: number | null) => void;
}

export const Desktop: React.FC<DesktopProps> = ({
    activeTab,
    setActiveTab,
    tabs,
    activeCompanyId,
    isSuperAdmin,
    companies,
    currentUser,
    setActiveCompanyId
}) => {
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
        <div className="space-y-8">
            <PosHeader
                isSuperAdmin={isSuperAdmin}
                activeCompanyId={activeCompanyId}
                setActiveCompanyId={setActiveCompanyId}
                companies={companies}
                currentUser={currentUser}
            />

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
