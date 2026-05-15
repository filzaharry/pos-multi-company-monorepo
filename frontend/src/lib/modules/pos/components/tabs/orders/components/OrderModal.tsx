import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, Save, User, Phone, Truck, CreditCard, Search, Tag, Loader2 } from 'lucide-react';
import { PosItem, PosLevel, PosExtra, PosDelivery, PosCategory, PosOrder, PosOrderItem } from '../../../../types';
import { CustomInput } from '@/components/ui/CustomInput';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { MultiSelect } from '@/components/ui/MultiSelect';
import { posService } from '../../../../services/pos.service';
import { useInfiniteScroll } from '@/lib/hooks/useInfiniteScroll';

interface OrderItem {
    product_id: number;
    name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    level_ids: number[];
    extra_ids: number[];
    available_levels: { label: string; value: number }[];
    available_extras: { label: string; value: number }[];
}

interface OrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<PosOrder>) => Promise<void>;
    companyId: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:8080';

export const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, onSubmit, companyId }) => {
    const [customerName, setCustomerName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [deliveryId, setDeliveryId] = useState<number>(0);
    const [paymentMethod, setPaymentMethod] = useState<number>(0);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

    // Product fetching state
    const [products, setProducts] = useState<PosItem[]>([]);
    const [categories, setCategories] = useState<PosCategory[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);

    // Other master data
    const [deliveries, setDeliveries] = useState<PosDelivery[]>([]);
    const [allLevels, setAllLevels] = useState<PosLevel[]>([]);
    const [allExtras, setAllExtras] = useState<PosExtra[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Image URL resolver
    const getImageUrl = (url: string | null) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return `${API_BASE_URL}${url}`;
    };

    useEffect(() => {
        if (isOpen && companyId) {
            fetchMasterData();
            resetProductList();
        }
    }, [isOpen, companyId]);

    const fetchMasterData = async () => {
        try {
            const [catRes, delRes, lvlRes, extRes] = await Promise.all([
                posService.getCategories(companyId, { page: 1, limit: 100 }),
                posService.getDeliveries(companyId, { page: 1, limit: 100 }),
                posService.getLevels(companyId, { page: 1, limit: 100 }),
                posService.getExtras(companyId, { page: 1, limit: 100 })
            ]);

            if (catRes.status === 'success' || catRes.status === 'Success') setCategories(catRes.data.result.items);
            if (delRes.status === 'success' || delRes.status === 'Success') setDeliveries(delRes.data.result.items);
            if (lvlRes.status === 'success' || lvlRes.status === 'Success') setAllLevels(lvlRes.data.result.items);
            if (extRes.status === 'success' || extRes.status === 'Success') setAllExtras(extRes.data.result.items);
        } catch (error) {
            console.error('Failed to fetch master data', error);
        }
    };

    const fetchProducts = useCallback(async () => {
        if (isLoadingProducts || !hasMore) return;

        setIsLoadingProducts(true);
        try {
            const response = await posService.getItems(companyId, {
                page,
                limit: 12,
                category_id: selectedCategoryId || undefined,
                search: searchQuery || undefined
            });

            if (response.status === 'success' || response.status === 'Success') {
                const newItems = response.data.result.items;
                setProducts(prev => (page === 1 ? newItems : [...prev, ...newItems]));
                setHasMore(newItems.length === 12);
                setPage(prev => prev + 1);
            }
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setIsLoadingProducts(false);
        }
    }, [companyId, page, selectedCategoryId, searchQuery, isLoadingProducts, hasMore]);

    const resetProductList = () => {
        setProducts([]);
        setPage(1);
        setHasMore(true);
        // We trigger the first fetch via useEffect or the infinite scroll hook's first trigger
    };

    // Effect to trigger initial product fetch and reset when filters change
    useEffect(() => {
        if (isOpen) {
            setProducts([]);
            setPage(1);
            setHasMore(true);
        }
    }, [selectedCategoryId, searchQuery, isOpen]);

    // Intersection Observer for Infinite Scroll
    const { lastElementRef } = useInfiniteScroll(fetchProducts, isLoadingProducts, hasMore);

    const addProductToOrder = (product: PosItem) => {
        const productLevelIds = product.level_ids ? product.level_ids.split(',').filter(Boolean).map(Number) : [];
        const productExtraIds = product.extra_ids ? product.extra_ids.split(',').filter(Boolean).map(Number) : [];

        const available_levels = allLevels
            .filter(l => productLevelIds.includes(l.id))
            .map(l => ({ label: l.name, value: l.id }));

        const available_extras = allExtras
            .filter(e => productExtraIds.includes(e.id))
            .map(e => ({ label: e.name, value: e.id }));

        const newItem: OrderItem = {
            product_id: product.id,
            name: product.name,
            quantity: 1,
            unit_price: product.price,
            subtotal: product.price,
            level_ids: [],
            extra_ids: [],
            available_levels,
            available_extras
        };

        setOrderItems([...orderItems, newItem]);
    };

    const updateItem = (index: number, updates: Partial<OrderItem>) => {
        const newItems = [...orderItems];
        newItems[index] = { ...newItems[index], ...updates };
        if (updates.quantity !== undefined || updates.unit_price !== undefined) {
            newItems[index].subtotal = newItems[index].quantity * newItems[index].unit_price;
        }
        setOrderItems(newItems);
    };

    const removeItem = (index: number) => {
        setOrderItems(orderItems.filter((_, i) => i !== index));
    };

    const totalAmount = useMemo(() => {
        return orderItems.reduce((sum, item) => sum + item.subtotal, 0);
    }, [orderItems]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (orderItems.length === 0) return;

        setIsSubmitting(true);
        try {
            const data: Partial<PosOrder> = {
                customer_name: customerName,
                phone_number: phoneNumber,
                delivery_id: deliveryId,
                payment_method: paymentMethod,
                total_amount: totalAmount,
                status: 0,
                order_items: orderItems.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    subtotal: item.subtotal,
                    level_ids: item.level_ids,
                    extra_ids: item.extra_ids
                } as PosOrderItem))
            };

            await onSubmit(data);
            onClose();
            setOrderItems([]);
            setCustomerName('');
            setPhoneNumber('');
            setDeliveryId(0);
            setPaymentMethod(0);
        } catch (error) {
            console.error('Failed to create order', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/40 backdrop-blur-md"
                />
                <motion.div
                    initial={{ scale: 0.98, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.98, opacity: 0, y: 10 }}
                    className="relative w-full max-w-[95vw] h-screen bg-[#0c0c0e] border border-white/5 rounded-[2.5rem] p-6 lg:p-10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] flex flex-col max-h-[92vh] overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-10 shrink-0">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-3xl flex items-center justify-center text-primary shadow-inner shadow-primary/20">
                                <ShoppingBag className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white italic uppercase tracking-widest">Create Transaction</h2>
                                <p className="text-xs text-gray-500 font-medium tracking-wider uppercase opacity-60">System Point of Sale v2.0</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="hidden lg:flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
                                <Search className="w-4 h-4 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-transparent border-none focus:outline-none text-xs text-white w-48 font-medium"
                                />
                            </div>
                            <button onClick={onClose} className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-hidden flex flex-col lg:flex-row gap-10">
                        {/* Left Side: Product Browsing */}
                        <div className="flex-1 flex flex-col overflow-hidden">
                            {/* Categories Selection */}
                            <div className="shrink-0 mb-8">
                                <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                                    <button
                                        onClick={() => setSelectedCategoryId(null)}
                                        className={`shrink-0 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${selectedCategoryId === null
                                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                                            : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'
                                            }`}
                                    >
                                        All Items
                                    </button>
                                    {categories.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCategoryId(cat.id)}
                                            className={`shrink-0 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${selectedCategoryId === cat.id
                                                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                                                : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'
                                                }`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Product Grid with Infinite Scroll */}
                            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {products.map((product, idx) => (
                                        <motion.button
                                            key={product.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            onClick={() => addProductToOrder(product)}
                                            className="group relative bg-white/[0.03] border border-white/5 hover:border-primary/50 p-4 rounded-[2rem] transition-all text-left flex flex-col items-center text-center"
                                        >
                                            <div className="relative w-full aspect-square bg-black/40 rounded-[1.5rem] mb-4 overflow-hidden border border-white/5">
                                                {getImageUrl(product.image_url ?? '') ? (
                                                    <img
                                                        src={getImageUrl(product.image_url ?? '')!}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-800">
                                                        <ShoppingBag className="w-10 h-10 opacity-20" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                                                    <div className="bg-primary text-white p-2 rounded-xl shadow-lg">
                                                        <Plus className="w-5 h-5" />
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-xs font-black text-white uppercase tracking-wider line-clamp-1 mb-1">{product.name}</p>
                                            <p className="text-[10px] text-primary font-black italic">Rp {product.price.toLocaleString()}</p>
                                        </motion.button>
                                    ))}

                                    {/* Invisible Trigger for Infinite Scroll */}
                                    <div ref={lastElementRef} className="col-span-full h-20 flex items-center justify-center">
                                        {isLoadingProducts && (
                                            <div className="flex items-center gap-3 text-primary animate-pulse">
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Loading Items...</span>
                                            </div>
                                        )}
                                        {!hasMore && products.length > 0 && (
                                            <span className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em]">End of Menu</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Order Summary */}
                        <div className="w-full lg:w-[28rem] shrink-0 flex flex-col overflow-hidden">
                            <div className="flex-1 flex flex-col bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden">
                                {/* Header Summary */}
                                <div className="p-8 border-b border-white/5">
                                    <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                        <div className="w-1 h-3 bg-primary rounded-full" />
                                        Cart Summary
                                    </h4>

                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                <User className="w-3 h-3" /> Customer
                                            </label>
                                            <input
                                                type="text"
                                                value={customerName}
                                                onChange={(e) => setCustomerName(e.target.value)}
                                                placeholder="Name"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-medium"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                <Phone className="w-3 h-3" /> Phone
                                            </label>
                                            <input
                                                type="text"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                                placeholder="Phone"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-medium"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Items List */}
                                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-4">
                                    {orderItems.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-700 opacity-40">
                                            <ShoppingBag className="w-16 h-16 mb-4" />
                                            <p className="text-[10px] font-black uppercase tracking-widest">Cart Empty</p>
                                        </div>
                                    ) : (
                                        orderItems.map((item, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="bg-white/[0.03] border border-white/5 rounded-3xl p-5 space-y-4 relative group"
                                            >
                                                <button
                                                    onClick={() => removeItem(index)}
                                                    className="absolute top-4 right-4 p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>

                                                <div className="flex justify-between items-start pr-10">
                                                    <div>
                                                        <p className="text-xs font-black text-white uppercase tracking-wider">{item.name}</p>
                                                        <p className="text-[10px] text-primary font-black mt-1">Rp {item.unit_price.toLocaleString()}</p>
                                                    </div>
                                                    <div className="flex items-center gap-4 bg-black/40 rounded-2xl px-3 py-1.5 border border-white/5">
                                                        <button onClick={() => updateItem(index, { quantity: Math.max(1, item.quantity - 1) })} className="text-gray-500 hover:text-white transition-colors">
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="text-xs font-black text-white w-4 text-center">{item.quantity}</span>
                                                        <button onClick={() => updateItem(index, { quantity: item.quantity + 1 })} className="text-gray-500 hover:text-white transition-colors">
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3">
                                                    {item.available_levels.length > 0 && (
                                                        <div className="space-y-1.5">
                                                            <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest ml-1">Level</label>
                                                            <MultiSelect
                                                                options={item.available_levels}
                                                                value={item.level_ids}
                                                                onChange={(vals) => updateItem(index, { level_ids: vals })}
                                                                placeholder="None"
                                                            />
                                                        </div>
                                                    )}
                                                    {item.available_extras.length > 0 && (
                                                        <div className="space-y-1.5">
                                                            <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest ml-1">Extra</label>
                                                            <MultiSelect
                                                                options={item.available_extras}
                                                                value={item.extra_ids}
                                                                onChange={(vals) => updateItem(index, { extra_ids: vals })}
                                                                placeholder="None"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </div>

                                {/* Footer Summary */}
                                <div className="p-8 bg-white/[0.03] border-t border-white/5 space-y-6">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2 ml-1">
                                                <Truck className="w-3 h-3" /> Delivery
                                            </label>
                                            <CustomSelect
                                                value={deliveryId.toString()}
                                                onChange={(e) => setDeliveryId(Number(e.target.value))}
                                                className="h-10 text-[10px] font-bold"
                                            >
                                                <option value="0" className="bg-[#0c0c0e]">Pickup / No Delivery</option>
                                                {deliveries.map(del => (
                                                    <option key={del.id} value={del.id} className="bg-[#0c0c0e]">{del.name}</option>
                                                ))}
                                            </CustomSelect>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2 ml-1">
                                                <CreditCard className="w-3 h-3" /> Payment
                                            </label>
                                            <CustomSelect
                                                value={paymentMethod.toString()}
                                                onChange={(e) => setPaymentMethod(Number(e.target.value))}
                                                className="h-10 text-[10px] font-bold"
                                            >
                                                <option value="0" className="bg-[#0c0c0e]">Cash</option>
                                                <option value="1" className="bg-[#0c0c0e]">QRIS / Digital</option>
                                            </CustomSelect>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-end pt-2">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Total Bill</p>
                                            <h3 className="text-3xl font-black text-white italic tracking-tighter">
                                                <span className="text-primary text-sm not-italic mr-1.5 uppercase">Rp</span>
                                                {totalAmount.toLocaleString()}
                                            </h3>
                                        </div>
                                        <button
                                            onClick={handleSubmit}
                                            disabled={isSubmitting || orderItems.length === 0}
                                            className="h-14 px-8 bg-primary hover:bg-primary/90 text-white rounded-[1.25rem] font-black italic uppercase tracking-widest transition-all shadow-xl shadow-primary/30 disabled:opacity-30 disabled:grayscale group"
                                        >
                                            <div className="flex items-center gap-3">
                                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                                                <span>{isSubmitting ? '...' : 'Process'}</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body
    );
};
