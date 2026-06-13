'use client';

import { Loader2, Store } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { StoreCompany, storefrontService } from '../services/storefront.service';
import { OrderingService } from '../../pos/components/ordering/types';
import { PosOrdering } from '../../pos/components/ordering/PosOrdering';
import { PosCategory, PosDelivery, PosExtra, PosItem, PosLevel } from '../../pos/types';

export const Storefront = () => {
    const params = useParams<{ route: string }>();
    const route = params?.route;

    const [company, setCompany] = useState<StoreCompany | null>(null);
    const [isLoadingInit, setIsLoadingInit] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const init = async () => {
            if (!route) return;
            try {
                const res = await storefrontService.resolveRoute(route);
                if (res.status === 'success' || res.status === 'Success') {
                    const companyData = res.data.result as unknown as StoreCompany;
                    setCompany(companyData);
                } else {
                    setError('Store is unavailable or inactive.');
                }
            } catch (err: unknown) {
                const error = err as { response?: { data?: { message?: string } } };
                setError(error?.response?.data?.message || 'Store not found or inactive.');
            } finally {
                setIsLoadingInit(false);
            }
        };
        init();
    }, [route]);

    const serviceAdapter: OrderingService = {
        getCategories: async (id) => {
            const res = await storefrontService.getCategories(id);
            return { items: (res.data?.result || []) as unknown as PosCategory[] };
        },
        getDeliveries: async (id) => {
            const res = await storefrontService.getDeliveries(id);
            return { items: (res.data?.result || []) as unknown as PosDelivery[] };
        },
        getLevels: async (id) => {
            const res = await storefrontService.getLevels(id, { page: 1, limit: 100 });
            return { items: (res.data?.result as { items?: PosLevel[] })?.items || (res.data?.result as unknown as PosLevel[]) || [] };
        },
        getExtras: async (id) => {
            const res = await storefrontService.getExtras(id, { page: 1, limit: 100 });
            return { items: (res.data?.result as { items?: PosExtra[] })?.items || (res.data?.result as unknown as PosExtra[]) || [] };
        },
        getProducts: async (id, categoryId, search, page) => {
            const res = await storefrontService.getProducts(id, categoryId, search);

            if (page && page > 1) {
                return { items: [] };
            }

            return { items: (res.data?.result || []) as unknown as PosItem[] };
        },
        createOrder: async (id, data) => {
            return storefrontService.createOrder(id, data);
        }
    };

    if (isLoadingInit) {
        return (
            <div className="flex flex-col items-center justify-center h-screen space-y-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-slate-500 font-medium animate-pulse">Loading Store...</p>
            </div>
        );
    }

    if (error || !company) {
        return (
            <div className="flex flex-col items-center justify-center h-screen px-6 text-center">
                <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-6">
                    <Store className="w-10 h-10 text-slate-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Oops!</h2>
                <p className="text-slate-500">{error || 'Store not found.'}</p>
            </div>
        );
    }

    return (
        <PosOrdering
            companyId={company.id}
            companyName={company.name}
            companyLogoUrl={company.logo_url}
            companyAddress={company.address}
            mode="storefront"
            service={serviceAdapter}
        />
    );
};
