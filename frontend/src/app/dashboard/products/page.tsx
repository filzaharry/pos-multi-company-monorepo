'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { apiRouter } from '@/lib/api/router';
import { useLogin } from '@/lib/modules/login/store/useLogin';
import { CategoriesListResponse, ItemsListResponse, PosCategory, PosItem } from '@/lib/modules/pos/types';
import { ApiResponse } from '@/lib/types/api';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
    AlertTriangle,
    Box,
    CheckCircle2,
    Edit2,
    Layers,
    Package,
    Plus,
    Search,
    ShoppingCart,
    Tag,
    Trash2,
    XCircle
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

export default function InventoryManagementPage() {
    const { activeCompanyId } = useLogin();
    const [products, setProducts] = useState<PosItem[]>([]);
    const [categories, setCategories] = useState<PosCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');

    // Filters
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    const fetchData = useCallback(async () => {
        if (!activeCompanyId) return;
        setIsLoading(true);
        try {
            const [prodRes, catRes] = await Promise.all([
                apiRouter.get<ApiResponse<ItemsListResponse>>('/pos/products'),
                apiRouter.get<ApiResponse<CategoriesListResponse>>('/pos/categories')
            ]);
            setProducts(prodRes.data.result.items);
            setCategories(catRes.data.result.items);
        } catch (error) {
            console.error('Failed to fetch inventory:', error);
        } finally {
            setIsLoading(false);
        }
    }, [activeCompanyId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.sku?.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory ? p.category_id === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });

    if (!activeCompanyId) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center h-[70vh] text-center">
                    <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
                        <AlertTriangle className="w-12 h-12 text-red-500" />
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight">No Company Selected</h2>
                    <p className="text-gray-500 mt-2 max-w-md">Please select a company to manage its inventory.</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-in fade-in duration-500">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
                            <Box className="w-10 h-10 text-primary" />
                            INVENTORY
                        </h1>
                        <p className="text-gray-500 font-medium mt-1">Manage products, categories, and stock levels</p>
                    </div>
                    <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 shadow-inner shadow-black/20">
                        <button
                            onClick={() => setActiveTab('products')}
                            className={cn(
                                "px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2",
                                activeTab === 'products' ? "bg-primary text-white shadow-lg" : "text-gray-500 hover:text-white"
                            )}
                        >
                            <ShoppingCart className="w-4 h-4" />
                            Products
                        </button>
                        <button
                            onClick={() => setActiveTab('categories')}
                            className={cn(
                                "px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2",
                                activeTab === 'categories' ? "bg-primary text-white shadow-lg" : "text-gray-500 hover:text-white"
                            )}
                        >
                            <Layers className="w-4 h-4" />
                            Categories
                        </button>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white/2 p-4 rounded-2xl border border-white/5">
                    <div className="relative md:col-span-2">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder={activeTab === 'products' ? "Search products..." : "Search categories..."}
                            className="w-full bg-background-dark border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    {activeTab === 'products' && (
                        <select
                            className="bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                            value={selectedCategory || ''}
                            onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    )}
                    <button className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-black text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                        <Plus className="w-5 h-5" />
                        ADD NEW
                    </button>
                </div>

                {/* Table View */}
                <div className="bg-white/2 rounded-3xl border border-white/5 overflow-hidden shadow-2xl backdrop-blur-sm">
                    {activeTab === 'products' ? (
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/2">
                                        <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap">Product Details</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap">Category</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap">Pricing</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap text-center">Stock</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap text-center">Status</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/2">
                                    {isLoading ? (
                                        [1, 2, 3].map(i => (
                                            <tr key={i} className="animate-pulse">
                                                <td colSpan={6} className="px-6 py-8">
                                                    <div className="h-10 bg-white/5 rounded-xl w-full" />
                                                </td>
                                            </tr>
                                        ))
                                    ) : filteredProducts.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-20 text-center">
                                                <div className="flex flex-col items-center gap-3 grayscale opacity-30">
                                                    <Package className="w-16 h-16 text-gray-500" />
                                                    <p className="text-gray-500 font-black tracking-widest uppercase text-xs">No products found</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredProducts.map((p, index) => (
                                            <motion.tr
                                                key={p.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="group hover:bg-white/[0.02] transition-colors"
                                            >
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                                            <Package className="w-6 h-6 text-primary" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-bold text-white text-lg truncate">{p.name}</p>
                                                            <p className="text-sm text-gray-500 font-medium tracking-widest uppercase">SKU: {p.sku || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5 w-fit">
                                                        <Tag className="w-3 h-3 text-primary" />
                                                        <span className="text-sm text-white font-medium">{p.category?.name || 'Uncategorized'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    <div className="flex flex-col">
                                                        <p className="text-lg font-black text-primary">Rp {p.price.toLocaleString()}</p>
                                                        {p.cost_price && <p className="text-xs text-gray-500 font-medium tracking-wider uppercase">Cost: Rp {p.cost_price.toLocaleString()}</p>}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <div className={cn(
                                                        "inline-flex flex-col items-center justify-center min-w-[80px] py-1.5 rounded-xl border font-black",
                                                        p.stock_quantity > 10 ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                                                    )}>
                                                        <span className="text-lg leading-none">{p.stock_quantity}</span>
                                                        <span className="text-[10px] uppercase opacity-60">PCS</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-center whitespace-nowrap">
                                                    {p.is_available ? (
                                                        <span className="flex items-center justify-center gap-1.5 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                                                            <CheckCircle2 className="w-3 h-3" /> Enabled
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center justify-center gap-1.5 text-red-500 text-[10px] font-black uppercase tracking-widest">
                                                            <XCircle className="w-3 h-3" /> Disabled
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button className="p-2.5 text-blue-400 hover:bg-blue-400/10 rounded-xl transition-all">
                                                            <Edit2 className="w-5 h-5" />
                                                        </button>
                                                        <button className="p-2.5 text-red-400 hover:bg-red-400/10 rounded-xl transition-all">
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/2">
                                        <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap">Category Name</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap">Description</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap text-center">Sort Order</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/2">
                                    {categories.map((cat, index) => (
                                        <motion.tr
                                            key={cat.id}
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group hover:bg-white/[0.02] transition-colors"
                                        >
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                                        <Tag className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <span className="text-white font-bold text-lg">{cat.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="text-gray-500 font-medium text-sm line-clamp-1">{cat.description || 'No description provided'}</p>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-white font-black text-xs">{cat.sort_order}</span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="p-2.5 text-blue-400 hover:bg-blue-400/10 rounded-xl transition-all">
                                                        <Edit2 className="w-5 h-5" />
                                                    </button>
                                                    <button className="p-2.5 text-red-400 hover:bg-red-400/10 rounded-xl transition-all">
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
