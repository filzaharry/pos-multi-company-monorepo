import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Check, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PosItem, PosLevel, PosExtra } from '../../types';
import { getImageUrl } from '@/lib/utils';
import { OrderItem } from './types';

interface ProductSheetProps {
    isOpen: boolean;
    product: PosItem | null;
    allLevels: PosLevel[];
    allExtras: PosExtra[];
    onClose: () => void;
    onAddToCart: (item: OrderItem) => void;
}

export const ProductSheet: React.FC<ProductSheetProps> = ({
    isOpen,
    product,
    allLevels,
    allExtras,
    onClose,
    onAddToCart
}) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
    const [selectedExtraIds, setSelectedExtraIds] = useState<number[]>([]);

    const parsedLevelIds = useMemo(() => {
        try {
            return product?.level_ids ? JSON.parse(product.level_ids as unknown as string) as number[] : [];
        } catch { return []; }
    }, [product]);

    const parsedExtraIds = useMemo(() => {
        try {
            return product?.extra_ids ? JSON.parse(product.extra_ids as unknown as string) as number[] : [];
        } catch { return []; }
    }, [product]);

    const [prevProductId, setPrevProductId] = useState<number | null>(null);
    const [prevIsOpen, setPrevIsOpen] = useState<boolean>(false);

    if (isOpen !== prevIsOpen || (isOpen && product && product.id !== prevProductId)) {
        setPrevIsOpen(isOpen);
        if (product) setPrevProductId(product.id);

        if (isOpen && product) {
            setQuantity(1);
            setSelectedExtraIds([]);
            const availableLevels = allLevels.filter(l => parsedLevelIds.includes(l.id));
            if (availableLevels.length > 0) {
                setSelectedLevelId(availableLevels[0].id);
            } else {
                setSelectedLevelId(null);
            }
        }
    }

    const availableLevels = useMemo(() => {
        return allLevels.filter(l => parsedLevelIds.includes(l.id));
    }, [allLevels, parsedLevelIds]);

    const availableExtras = useMemo(() => {
        return allExtras.filter(e => parsedExtraIds.includes(e.id));
    }, [allExtras, parsedExtraIds]);

    const calculateSubtotal = () => {
        if (!product) return 0;
        let unitPrice = product.price;

        if (selectedLevelId) {
            const level = availableLevels.find(l => l.id === selectedLevelId);
            if (level) unitPrice += Number((level as { price?: string }).price) || 0;
        }

        selectedExtraIds.forEach(id => {
            const extra = availableExtras.find(e => e.id === id);
            if (extra) unitPrice += Number(extra.price) || 0;
        });

        return unitPrice * quantity;
    };

    const handleAddToCart = () => {
        if (!product) return;

        // Validation: If levels exist, one must be selected
        if (availableLevels.length > 0 && !selectedLevelId) {
            alert('Please select a level.');
            return;
        }

        const unitPrice = calculateSubtotal() / quantity;

        const orderItem: OrderItem = {
            product_id: product.id,
            name: product.name,
            quantity,
            unit_price: unitPrice,
            subtotal: calculateSubtotal(),
            level_ids: selectedLevelId ? [selectedLevelId] : [],
            extra_ids: selectedExtraIds,
            available_levels: availableLevels.map(l => ({ label: l.name, value: l.id })),
            available_extras: availableExtras.map(e => ({ label: e.name, value: e.id }))
        };

        onAddToCart(orderItem);
        onClose();
    };

    const toggleExtra = (id: number) => {
        setSelectedExtraIds(prev =>
            prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
        );
    };

    return (
        <AnimatePresence>
            {isOpen && product && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
                    />
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                        className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex flex-col max-h-[90vh]"
                    >
                        {/* Drag Handle */}
                        <div className="w-full flex justify-center py-4 shrink-0">
                            <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto px-6 md:px-10 pb-48 md:pb-32 custom-scrollbar">
                            <div className="flex flex-col md:flex-row gap-6 md:gap-10 mb-8">
                                <div className="w-full md:w-48 aspect-square shrink-0 bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-100 flex items-center justify-center relative">
                                    {getImageUrl(product.image_url ?? '') ? (
                                        <img
                                            src={getImageUrl(product.image_url ?? '')!}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <ShoppingBag className="w-16 h-16 opacity-20 text-slate-800" />
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col justify-center">
                                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 ">{product.name}</h2>
                                    <p className="text-slate-500 mt-2">{product.description || 'No description available.'}</p>
                                    <p className="text-xl md:text-2xl text-primary font-bold mt-4">Rp {product.price.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="space-y-8">
                                {/* Levels Selection (Required) */}
                                {availableLevels.length > 0 && (
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-sm font-bold text-slate-800 ">Select Level</h3>
                                            <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-md      ">Required</span>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3">
                                            {availableLevels.map(level => (
                                                <button
                                                    key={level.id}
                                                    onClick={() => setSelectedLevelId(level.id)}
                                                    className={`flex flex-row items-center justify-between p-4 rounded-2xl border-2 transition-all ${selectedLevelId === level.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}
                                                >
                                                    <span className="text-xs font-bold text-slate-800  text-left">{level.name}</span>
                                                    <div className="flex items-center gap-3 shrink-0">
                                                        {Boolean((level as { price?: string }).price) && <span className="text-[10px] font-bold text-primary">+ Rp {Number((level as { price?: string }).price).toLocaleString()}</span>}
                                                        {selectedLevelId === level.id && <Check className="w-4 h-4 text-primary" />}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Extras Selection (Optional) */}
                                {availableExtras.length > 0 && (
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-sm font-bold text-slate-800 ">Add Extras</h3>
                                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md      ">Optional</span>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3">
                                            {availableExtras.map(extra => {
                                                const isSelected = selectedExtraIds.includes(extra.id);
                                                return (
                                                    <button
                                                        key={extra.id}
                                                        onClick={() => toggleExtra(extra.id)}
                                                        className={`flex flex-row items-center justify-between p-4 rounded-2xl border-2 transition-all ${isSelected ? 'border-primary bg-primary/5 shadow-sm' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}
                                                    >
                                                        <span className="text-xs font-bold text-slate-800  text-left">{extra.name}</span>
                                                        <div className="flex items-center gap-3 shrink-0">
                                                            <span className="text-[10px] font-bold text-primary">+ Rp {Number(extra.price).toLocaleString()}</span>
                                                            {isSelected && <Check className="w-4 h-4 text-primary" />}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Quantity */}
                                <div>
                                    <h3 className="text-sm font-bold text-slate-800  mb-4">Quantity</h3>
                                    <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-2xl p-2 w-max">
                                        <Button theme="light" variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 text-slate-800 hover:text-primary">
                                            <Minus className="w-4 h-4" />
                                        </Button>
                                        <span className="text-lg font-bold text-slate-800 w-12 text-center">{quantity}</span>
                                        <Button theme="light" variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 text-slate-800 hover:text-primary">
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Fixed Footer */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-white border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div>
                                <p className="text-[10px] font-bold text-slate-500  mb-1">Subtotal</p>
                                <h3 className="text-3xl font-bold text-slate-800 tracking-tighter">
                                    <span className="text-primary text-sm mr-1.5  ">Rp</span>
                                    {calculateSubtotal().toLocaleString()}
                                </h3>
                            </div>
                            <Button
                                onClick={handleAddToCart}
                                theme="light"
                                size="lg"
                                className="w-full md:w-auto h-14 px-10 rounded-[1.25rem] text-sm "
                                icon={ShoppingBag}
                            >
                                Add to Cart
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
