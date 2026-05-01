'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
    Search,
    Plus,
    Minus,
    Trash2,
    ShoppingCart,
    CreditCard,
    User,
    ChevronRight,
    SearchX,
    LayoutGrid,
    LayoutList,
    CheckCircle2,
    XCircle,
    Package,
    ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLogin } from '@/lib/modules/login/store/useLogin';
import { apiRouter } from '@/lib/api/router';
import { PosProduct, PosCategory, PosOrderItem } from '@/lib/modules/pos/types';
import { useToast } from '@/components/ui/Toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function PointOfSalePage() {
    const { activeCompanyId } = useLogin();
    const { showToast } = useToast();
    const [products, setProducts] = useState<PosProduct[]>([]);
    const [categories, setCategories] = useState<PosCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Cart State
    const [cart, setCart] = useState<PosOrderItem[]>([]);
    const [customerName, setCustomerName] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const fetchPOSData = async () => {
        if (!activeCompanyId) return;
        setIsLoading(true);
        try {
            const [prodRes, catRes] = await Promise.all([
                apiRouter.get<any>('/pos/products'),
                apiRouter.get<any>('/pos/categories')
            ]);
            setProducts(prodRes.data);
            setCategories(catRes.data);
        } catch (error) {
            console.error('Failed to fetch POS data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPOSData();
    }, [activeCompanyId]);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesCategory = selectedCategory ? p.category_id === selectedCategory : true;
            const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.sku?.toLowerCase().includes(search.toLowerCase());
            return matchesCategory && matchesSearch && p.is_available;
        });
    }, [products, selectedCategory, search]);

    const addToCart = (product: PosProduct) => {
        if (product.stock_quantity <= 0) {
            showToast('Product out of stock', 'error');
            return;
        }

        const existingItem = cart.find(item => item.product_id === product.id);
        if (existingItem) {
            if (existingItem.quantity >= product.stock_quantity) {
                showToast('Insufficient stock', 'error');
                return;
            }
            setCart(cart.map(item =>
                item.product_id === product.id
                    ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.unit_price }
                    : item
            ));
        } else {
            setCart([...cart, {
                product_id: product.id,
                quantity: 1,
                unit_price: product.price,
                subtotal: product.price,
                product: product
            }]);
        }
    };

    const updateQuantity = (productId: number, delta: number) => {
        setCart(cart.map(item => {
            if (item.product_id === productId) {
                const newQty = Math.max(0, item.quantity + delta);
                if (newQty > (item.product?.stock_quantity || 0)) {
                    showToast('Max stock reached', 'error');
                    return item;
                }
                return { ...item, quantity: newQty, subtotal: newQty * item.unit_price };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const removeFromCart = (productId: number) => {
        setCart(cart.filter(item => item.product_id !== productId));
    };

    const cartTotal = cart.reduce((acc, item) => acc + item.subtotal, 0);
    const taxAmount = cartTotal * 0.1; // 10% Tax example
    const grandTotal = cartTotal + taxAmount;

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setIsProcessing(true);
        try {
            await apiRouter.post('/pos/orders', {
                customer_name: customerName,
                total_amount: grandTotal,
                tax_amount: taxAmount,
                discount_amount: 0,
                payment_method: 'Cash',
                payment_status: 'paid',
                order_items: cart.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    subtotal: item.subtotal
                }))
            });
            showToast('Order completed successfully', 'success');
            setCart([]);
            setCustomerName('');
            fetchPOSData(); // Refresh stock
        } catch (error: any) {
            showToast(error.response?.data?.message || 'Checkout failed', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    if (!activeCompanyId) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center h-[70vh] text-center">
                    <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
                        <XCircle className="w-12 h-12 text-red-500" />
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight">No Company Selected</h2>
                    <p className="text-gray-500 mt-2 max-w-md">As a Super Admin, please select a subscriber from the Topbar to access their POS system.</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] gap-6 overflow-hidden">
                {/* Main POS Interface */}
                <div className="flex-1 flex flex-col gap-6 min-w-0">
                    {/* Categories Strip */}
                    <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar pb-2 shrink-0">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={cn(
                                "flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition-all border",
                                selectedCategory === null
                                    ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                                    : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                            )}
                        >
                            All Categories
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={cn(
                                    "flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition-all border",
                                    selectedCategory === cat.id
                                        ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                                        : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                                )}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Search & Layout Toggle */}
                    <div className="flex items-center justify-between gap-4 shrink-0">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search products by name or SKU..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={cn("p-2 rounded-lg transition-all", viewMode === 'grid' ? "bg-primary text-white" : "text-gray-500 hover:text-white")}
                            >
                                <LayoutGrid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={cn("p-2 rounded-lg transition-all", viewMode === 'list' ? "bg-primary text-white" : "text-gray-500 hover:text-white")}
                            >
                                <LayoutList className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-6">
                        {isLoading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                    <div key={i} className="aspect-square bg-white/5 rounded-2xl animate-pulse" />
                                ))}
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full py-20 grayscale opacity-30">
                                <SearchX className="w-20 h-20 text-gray-500" />
                                <p className="mt-4 font-black uppercase tracking-widest text-xs text-gray-500">No products found</p>
                            </div>
                        ) : (
                            <div className={cn(
                                "grid gap-4",
                                viewMode === 'grid' ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
                            )}>
                                <AnimatePresence mode="popLayout">
                                    {filteredProducts.map(product => (
                                        <motion.div
                                            key={product.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            onClick={() => addToCart(product)}
                                            className={cn(
                                                "group relative bg-white/2 border border-white/5 rounded-2xl p-4 cursor-pointer transition-all hover:border-primary/50 hover:bg-white/5 active:scale-95",
                                                product.stock_quantity <= 0 && "opacity-50 grayscale pointer-events-none"
                                            )}
                                        >
                                            {/* Stock Badge */}
                                            <div className={cn(
                                                "absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter",
                                                product.stock_quantity > 10 ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                                            )}>
                                                {product.stock_quantity} Left
                                            </div>

                                            {viewMode === 'grid' ? (
                                                <div className="flex flex-col h-full gap-3">
                                                    <div className="aspect-square bg-linear-to-br from-white/10 to-transparent rounded-xl flex items-center justify-center overflow-hidden">
                                                        {product.image_url ? (
                                                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                        ) : (
                                                            <Package className="w-12 h-12 text-white/10 group-hover:text-primary transition-colors duration-500" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-white group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                                                        <p className="text-xl font-black text-primary mt-1">
                                                            Rp {product.price.toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center shrink-0">
                                                        <Package className="w-8 h-8 text-white/10" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-bold text-white text-lg">{product.name}</h3>
                                                        <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">{product.category?.name}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-2xl font-black text-primary">Rp {product.price.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Cart & Checkout */}
                <div className="w-full lg:w-[400px] flex flex-col bg-white/2 border border-white/5 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
                    {/* Panel Header */}
                    <div className="p-6 border-b border-white/5 bg-white/2">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-black text-white flex items-center gap-3">
                                <ShoppingCart className="w-6 h-6 text-primary" />
                                CURRENT ORDER
                            </h2>
                            <button
                                onClick={() => setCart([])}
                                className="text-red-400 hover:text-red-300 text-xs font-black uppercase tracking-widest"
                            >
                                Clear All
                            </button>
                        </div>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Walk-in Customer"
                                className="w-full bg-background-dark border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
                        <AnimatePresence mode="popLayout">
                            {cart.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full py-10 grayscale opacity-20 text-center">
                                    <ShoppingCart className="w-16 h-16 text-gray-400 mb-4" />
                                    <p className="text-gray-400 font-black uppercase text-xs tracking-[0.2em]">Your cart is empty</p>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <motion.div
                                        key={item.product_id}
                                        layout
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="flex items-center gap-4 group"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                                            <Package className="w-6 h-6 text-white/20" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-white text-sm truncate">{item.product?.name}</h4>
                                            <p className="text-primary font-black">Rp {item.unit_price.toLocaleString()}</p>
                                        </div>
                                        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg border border-white/10">
                                            <button
                                                onClick={() => updateQuantity(item.product_id, -1)}
                                                className="p-1 text-gray-400 hover:text-white transition-all"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="w-6 text-center text-sm font-black text-white">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.product_id, 1)}
                                                className="p-1 text-gray-400 hover:text-white transition-all"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.product_id)}
                                            className="p-2 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer Summary */}
                    <div className="p-6 bg-white/2 border-t border-white/5 space-y-4">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-gray-500 font-medium">
                                <span>Subtotal</span>
                                <span>Rp {cartTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-500 font-medium">
                                <span>Tax (10%)</span>
                                <span>Rp {taxAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-white font-black text-xl pt-2 border-t border-white/5">
                                <span className="uppercase tracking-widest">Total</span>
                                <span className="text-primary font-black">Rp {grandTotal.toLocaleString()}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={cart.length === 0 || isProcessing}
                            className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-black py-4 rounded-2xl shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {isProcessing ? 'Processing...' : (
                                <>
                                    <CreditCard className="w-6 h-6" />
                                    PLACE ORDER
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
