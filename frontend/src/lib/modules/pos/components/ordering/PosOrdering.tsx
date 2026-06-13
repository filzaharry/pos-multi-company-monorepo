import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, Loader2, Save, X, Search, ShoppingBag } from 'lucide-react';
import { getImageUrl } from '@/lib/utils';
import { PosCategory, PosDelivery, PosExtra, PosItem, PosLevel, PosOrder } from '../../types';
import { OrderItem, OrderingService } from './types';
import { ProductGrid } from './ProductGrid';
import { Sidebar } from './Sidebar';
import { ProductSheet } from './ProductSheet';
import { Button } from '@/components/ui/Button';
import { InputText } from '@/components/ui/input';

interface PosOrderingProps {
    companyId: number;
    companyName: string;
    companyLogoUrl?: string;
    companyAddress?: string;
    service: OrderingService;
    onClose?: () => void;
    mode: 'storefront' | 'modal';
}

export const PosOrdering: React.FC<PosOrderingProps> = ({
    companyId,
    companyName,
    companyLogoUrl,
    companyAddress,
    service,
    onClose,
    mode
}) => {
    // Master Data
    const [categories, setCategories] = useState<PosCategory[]>([]);
    const [deliveries, setDeliveries] = useState<PosDelivery[]>([]);
    const [allLevels, setAllLevels] = useState<PosLevel[]>([]);
    const [allExtras, setAllExtras] = useState<PosExtra[]>([]);

    // Product Fetching
    const [products, setProducts] = useState<PosItem[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const [isLoadingInit, setIsLoadingInit] = useState(true);

    // Order State
    const [customerName, setCustomerName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [deliveryId, setDeliveryId] = useState<number>(0);
    const [paymentMethod, setPaymentMethod] = useState<number>(0);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Sheet State
    const [selectedProduct, setSelectedProduct] = useState<PosItem | null>(null);

    const totalAmount = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

    // Initialize Data
    useEffect(() => {
        const init = async () => {
            try {
                const [catRes, delRes, lvlRes, extRes] = await Promise.all([
                    service.getCategories(companyId),
                    service.getDeliveries(companyId),
                    service.getLevels(companyId),
                    service.getExtras(companyId)
                ]);
                setCategories(catRes.items);
                setDeliveries(delRes.items);
                setAllLevels(lvlRes.items);
                setAllExtras(extRes.items);
            } catch (error) {
                console.error('Failed to fetch master data', error);
            } finally {
                setIsLoadingInit(false);
            }
        };
        init();
    }, [companyId, service]);

    // Fetch Products
    const fetchProducts = useCallback(async () => {
        if (isLoadingProducts || !hasMore) return;
        setIsLoadingProducts(true);
        try {
            const res = await service.getProducts(companyId, selectedCategoryId || undefined, searchQuery || undefined, page);
            const newItems = res.items;
            setProducts(prev => (page === 1 ? newItems : [...prev, ...newItems]));
            setHasMore(newItems.length > 0);
            setPage(p => p + 1);
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setIsLoadingProducts(false);
        }
    }, [companyId, service, selectedCategoryId, searchQuery, page, hasMore, isLoadingProducts]);

    useEffect(() => {
        setPage(1);
        setProducts([]);
        setHasMore(true);
    }, [selectedCategoryId, searchQuery]);

    useEffect(() => {
        if (page === 1 && hasMore) {
            fetchProducts();
        }
    }, [page, hasMore, fetchProducts]);

    // Order Actions
    const handleAddToCart = (item: OrderItem) => {
        setOrderItems(prev => [...prev, item]);
    };

    const removeItem = (index: number) => {
        setOrderItems(prev => prev.filter((_, i) => i !== index));
    };

    const updateItemQuantity = (index: number, quantity: number) => {
        setOrderItems(prev => {
            const newItems = [...prev];
            const item = { ...newItems[index] };
            item.quantity = quantity;

            // Recalculate unit price base
            const basePrice = item.unit_price;
            item.subtotal = basePrice * quantity;

            newItems[index] = item;
            return newItems;
        });
    };

    const handleSubmit = async () => {
        if (orderItems.length === 0 || !customerName.trim()) return;

        setIsSubmitting(true);
        try {
            const data: Partial<PosOrder> = {
                company_id: companyId,
                customer_name: customerName,
                phone_number: phoneNumber,
                delivery_id: deliveryId || 0,
                payment_method: paymentMethod,
                total_amount: totalAmount,
                tax_amount: 0,
                discount_amount: 0,
                status: 0,
                payment_status: 'PENDING',
                order_items: orderItems.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    subtotal: item.subtotal,
                    level_ids: item.level_ids,
                    extra_ids: item.extra_ids
                }))
            };

            await service.createOrder(companyId, data);

            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                setOrderItems([]);
                setCustomerName('');
                setPhoneNumber('');
                setDeliveryId(0);
                setPaymentMethod(0);
                if (mode === 'modal' && onClose) {
                    onClose();
                }
            }, 3000);

        } catch (error) {
            console.error('Failed to create order', error);
            alert('Failed to place order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingInit) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[50vh] space-y-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-slate-500 font-medium animate-pulse">Loading Menu...</p>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[50vh] px-6 text-center bg-green-50 rounded-[2.5rem]">
                <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-green-500/50">
                    <Save className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Order Received!</h2>
                <p className="text-slate-600 font-medium">Your order has been placed successfully.</p>
            </div>
        );
    }

    return (
        <div className={`flex flex-col h-full ${mode === 'storefront' ? 'min-h-screen bg-slate-50' : 'bg-white'}`}>
            {/* Header */}
            <div className={`shrink-0 ${mode === 'storefront' ? 'bg-white border-b border-slate-200 sticky top-0 z-10' : 'mb-8'}`}>
                <div className={`${mode === 'storefront' ? 'max-w-[1600px] mx-auto px-6 py-4' : ''}`}>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            {mode === 'storefront' ? (
                                <>
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center overflow-hidden border border-primary/20">
                                        {companyLogoUrl ? (
                                            <img src={getImageUrl(companyLogoUrl)!} alt={companyName} className="w-full h-full object-cover" />
                                        ) : (
                                            <Store className="w-6 h-6 text-primary" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h1 className="text-lg font-bold text-slate-800 leading-none">{companyName}</h1>
                                        {companyAddress && <p className="text-xs text-slate-500 mt-1 line-clamp-1">{companyAddress}</p>}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-3xl flex items-center justify-center text-primary shadow-inner shadow-primary/20">
                                        <ShoppingBag className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-800 ">Create Transaction</h2>
                                        <p className="text-xs text-slate-800 font-medium       opacity-60">System Point of Sale</p>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <div className="w-full sm:w-72">
                                <InputText
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    icon={Search}
                                    variant="light"
                                />
                            </div>
                            {mode === 'modal' && onClose && (
                                <Button theme="light" variant="ghost" size="icon" onClick={onClose} className="rounded-2xl border border-transparent hover:border-slate-200 bg-slate-50 hidden lg:flex">
                                    <X className="w-6 h-6 text-slate-800" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col lg:flex-row gap-6 lg:gap-10 overflow-hidden ${mode === 'storefront' ? 'max-w-[1600px] w-full mx-auto p-4 lg:p-6' : ''}`}>
                <ProductGrid
                    categories={categories}
                    selectedCategoryId={selectedCategoryId}
                    setSelectedCategoryId={setSelectedCategoryId}
                    products={products}
                    isLoadingProducts={isLoadingProducts}
                    hasMore={hasMore}
                    onLoadMore={fetchProducts}
                    onProductClick={(product) => setSelectedProduct(product)}
                />

                <Sidebar
                    orderItems={orderItems}
                    customerName={customerName}
                    setCustomerName={setCustomerName}
                    phoneNumber={phoneNumber}
                    setPhoneNumber={setPhoneNumber}
                    deliveryId={deliveryId}
                    setDeliveryId={setDeliveryId}
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    deliveries={deliveries}
                    totalAmount={totalAmount}
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmit}
                    removeItem={removeItem}
                    updateItemQuantity={updateItemQuantity}
                />
            </div>

            {/* Bottom Sheet */}
            <ProductSheet
                isOpen={!!selectedProduct}
                product={selectedProduct}
                allLevels={allLevels}
                allExtras={allExtras}
                onClose={() => setSelectedProduct(null)}
                onAddToCart={handleAddToCart}
            />
        </div>
    );
};
