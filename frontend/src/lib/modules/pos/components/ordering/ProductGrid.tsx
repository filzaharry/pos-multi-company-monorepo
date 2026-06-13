import React, { useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Plus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PosCategory, PosItem } from '../../types';
import { getImageUrl } from '@/lib/utils';

interface ProductGridProps {
    categories: PosCategory[];
    selectedCategoryId: number | null;
    setSelectedCategoryId: (id: number | null) => void;
    products: PosItem[];
    isLoadingProducts: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
    onProductClick: (product: PosItem) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
    products,
    isLoadingProducts,
    hasMore,
    onLoadMore,
    onProductClick
}) => {
    // Intersection Observer for Infinite Scrolling
    const observer = useRef<IntersectionObserver | null>(null);
    const lastElementRef = useCallback((node: HTMLDivElement | null) => {
        if (isLoadingProducts) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                onLoadMore();
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoadingProducts, hasMore, onLoadMore]);

    return (
        <div className="flex-1 flex flex-col min-h-0">
            {/* Categories Selection */}
            <div className="shrink-0 mb-6">
                <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                    <Button
                        theme="light"
                        variant={selectedCategoryId === null ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategoryId(null)}
                        className="shrink-0 text-[10px]"
                    >
                        All Items
                    </Button>
                    {categories.map(cat => (
                        <Button
                            key={cat.id}
                            theme="light"
                            variant={selectedCategoryId === cat.id ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedCategoryId(cat.id)}
                            className="shrink-0 text-[10px]"
                        >
                            {cat.name}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Product Grid */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 pb-24 lg:pb-0">
                    {products.length === 0 && !isLoadingProducts ? (
                        <div className="col-span-full py-12 text-center text-slate-500 text-sm font-medium">
                            No items found.
                        </div>
                    ) : (
                        products.map((product, idx) => (
                            <motion.button
                                key={product.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: Math.min(idx, 10) * 0.05 }}
                                onClick={() => onProductClick(product)}
                                className="group relative bg-white border border-slate-200 hover:border-primary p-4 rounded-[2rem] transition-all text-left flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:shadow-primary/10"
                            >
                                <div className="relative w-full aspect-square bg-slate-50 rounded-[1.5rem] mb-4 overflow-hidden border border-slate-100">
                                    {getImageUrl(product.image_url ?? '') ? (
                                        <img
                                            src={getImageUrl(product.image_url ?? '')!}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-800">
                                            <ShoppingBag className="w-10 h-10 opacity-20" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                                        <div className="bg-primary text-white px-4 py-2 rounded-xl shadow-lg font-bold text-xs  flex items-center gap-2">
                                            <Plus className="w-4 h-4" /> Add
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs font-bold text-slate-800       line-clamp-1 mb-1">{product.name}</p>
                                <p className="text-[10px] text-primary font-bold">Rp {product.price.toLocaleString()}</p>
                            </motion.button>
                        ))
                    )}

                    {/* Infinite Scroll Trigger */}
                    <div ref={lastElementRef} className="col-span-full h-20 flex items-center justify-center">
                        {isLoadingProducts && (
                            <div className="flex items-center gap-3 text-primary animate-pulse">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span className="text-[10px]  font-bold">Loading Items...</span>
                            </div>
                        )}
                        {!hasMore && products.length > 0 && (
                            <span className="text-[10px] text-slate-800 font-bold   tracking-[0.2em]">End of Menu</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
