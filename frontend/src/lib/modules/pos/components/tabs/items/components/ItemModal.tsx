import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, Save, Image as ImageIcon, Upload } from 'lucide-react';
import { PosItem } from '../../../../types';
import { CustomInput } from '@/components/ui/CustomInput';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { LookupOption } from '@/lib/modules/users/types';
import { MultiSelect } from '@/components/ui/MultiSelect';

interface ItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: FormData) => Promise<void>;
    item?: PosItem | null;
    categories: LookupOption[];
    levels: LookupOption[];
    extras: LookupOption[];
    companyId: number;
}

export const ItemModal: React.FC<ItemModalProps> = ({ isOpen, onClose, onSubmit, item, categories, levels, extras, companyId }) => {
    const [formData, setFormData] = useState<Partial<PosItem>>({
        name: '',
        sku: '',
        category_id: 0,
        product_type: 0,
        price: 0,
        cost_price: 0,
        stock_quantity: 0,
        track_stock: true,
        is_available: true,
        description: '',
        level_ids: '',
        extra_ids: '',
    });
    const [selectedLevels, setSelectedLevels] = useState<number[]>([]);
    const [selectedExtras, setSelectedExtras] = useState<number[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const generateSKU = () => {
        const d = new Date();
        const ddmmyy = `${String(d.getDate()).padStart(2, '0')}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getFullYear()).slice(2)}`;
        const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase();
        return `SKU${companyId}${ddmmyy}${randomStr}`;
    };

    useEffect(() => {
        if (item) {
            setFormData({
                ...item,
            });
            setSelectedLevels(item.level_ids ? item.level_ids.split(',').filter(Boolean).map(Number) : []);
            setSelectedExtras(item.extra_ids ? item.extra_ids.split(',').filter(Boolean).map(Number) : []);
            setImageFile(null);
            if (item.image_url) {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || '';
                const cleanPath = item.image_url.startsWith('/') ? item.image_url : `/${item.image_url}`;
                setImagePreview(`${baseUrl}${cleanPath}`);
            } else {
                setImagePreview(null);
            }
        } else {
            setFormData({
                name: '',
                sku: generateSKU(),
                category_id: categories.length > 0 ? Number(categories[0].value) : 0,
                product_type: 0,
                price: 0,
                cost_price: 0,
                stock_quantity: 0,
                track_stock: true,
                is_available: true,
                description: '',
            });
            setSelectedLevels([]);
            setSelectedExtras([]);
            setImageFile(null);
            setImagePreview(null);
        }
    }, [item, categories, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        let finalValue: unknown = value;

        if (type === 'checkbox') {
            finalValue = (e.target as HTMLInputElement).checked;
        } else if (type === 'number' || name === 'category_id' || name === 'product_type') {
            finalValue = Number(value);
        }

        setFormData((prev: Partial<PosItem>) => {
            const nextData = { ...prev, [name]: finalValue };
            if (name === 'product_type' && finalValue === 1) {
                nextData.stock_quantity = 0;
            }
            return nextData;
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const submitData = new FormData();

            // Explicitly add only the fields expected by the backend DTO
            const fields = [
                'name', 'sku', 'category_id', 'product_type',
                'price', 'cost_price', 'stock_quantity',
                'track_stock', 'is_available', 'description',
                'image_url'
            ];

            fields.forEach(field => {
                const value = formData[field as keyof PosItem];
                if (value !== undefined && value !== null) {
                    submitData.append(field, value.toString());
                }
            });

            // Append levels and extras as multiple values for the same key
            selectedLevels.forEach(id => submitData.append('level_ids', id.toString()));
            selectedExtras.forEach(id => submitData.append('extra_ids', id.toString()));

            if (imageFile) {
                submitData.append('image', imageFile);
            }

            await onSubmit(submitData);
            onClose();
        } catch (error) {
            console.error('Failed to submit item', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!mounted) return null;

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 lg:p-8 shadow-2xl flex flex-col max-h-[90vh]"
                    >
                        <div className="flex items-center justify-between mb-8 shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center text-primary">
                                    <Package className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-800 italic uppercase tracking-wider">
                                        {item ? 'Edit Item' : 'New Item'}
                                    </h2>
                                    <p className="text-sm text-slate-800">
                                        {item ? 'Update item details and inventory' : 'Add a new product to your inventory'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-slate-800 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em] px-1">Item Name *</label>
                                    <CustomInput
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name || ''}
                                        onChange={handleChange}
                                        placeholder="e.g. Classic Burger"
                                        variant="light"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em] px-1">SKU / Barcode</label>
                                    <CustomInput
                                        type="text"
                                        name="sku"
                                        value={formData.sku || ''}
                                        onChange={handleChange}
                                        placeholder="Auto-generated"
                                        disabled={true}
                                        className="opacity-50 cursor-not-allowed"
                                        variant="light"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em] px-1">Category *</label>
                                    <CustomSelect
                                        name="category_id"
                                        required
                                        value={formData.category_id || ''}
                                        onChange={handleChange}
                                        variant="light"
                                    >
                                        <option value="" disabled>Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.value} value={cat.value} className="bg-white text-slate-800">{cat.label}</option>
                                        ))}
                                    </CustomSelect>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em] px-1">Product Type</label>
                                    <CustomSelect
                                        name="product_type"
                                        value={formData.product_type?.toString()}
                                        onChange={handleChange}
                                        variant="light"
                                    >
                                        <option value="0" className="bg-white text-slate-800">Retail (Barang Jadi)</option>
                                        <option value="1" className="bg-white text-slate-800">Food/Drink (Olahan)</option>
                                    </CustomSelect>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em] px-1">Selling Price *</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold z-10">Rp</span>
                                        <CustomInput
                                            type="number"
                                            name="price"
                                            required
                                            min="0"
                                            value={formData.price || ''}
                                            onChange={handleChange}
                                            className="pl-12"
                                            variant="light"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em] px-1">Cost Price</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold z-10">Rp</span>
                                        <CustomInput
                                            type="number"
                                            name="cost_price"
                                            min="0"
                                            value={formData.cost_price || ''}
                                            onChange={handleChange}
                                            className="pl-12"
                                            variant="light"
                                        />
                                    </div>
                                </div>
                                {formData.product_type === 0 && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em] px-1">Stock Quantity *</label>
                                        <CustomInput
                                            type="number"
                                            name="stock_quantity"
                                            required
                                            min="0"
                                            value={formData.stock_quantity || ''}
                                            onChange={handleChange}
                                            placeholder="Enter initial stock"
                                            variant="light"
                                        />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <MultiSelect
                                        label="item levels"
                                        options={levels.map(l => ({ label: l.label, value: Number(l.value) }))}
                                        value={selectedLevels}
                                        onChange={setSelectedLevels}
                                        placeholder="No levels selected"
                                        variant="light"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <MultiSelect
                                        label="item extras"
                                        options={extras.map(e => ({ label: e.label, value: Number(e.value) }))}
                                        value={selectedExtras}
                                        onChange={setSelectedExtras}
                                        placeholder="No extras selected"
                                        variant="light"
                                    />
                                </div>

                                <div className="space-y-4 md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200 mt-2">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-800">Track Stock</h4>
                                            <p className="text-xs text-slate-800 opacity-70">Automatically reduce stock upon sale</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" name="track_stock" checked={formData.track_stock} onChange={handleChange} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                    <hr className="border-slate-200" />
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-800">Available for Sale</h4>
                                            <p className="text-xs text-slate-800 opacity-70">Show this item in the POS system</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" name="is_available" checked={formData.is_available} onChange={handleChange} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em] px-1">Description</label>
                                    <textarea
                                        name="description"
                                        rows={3}
                                        value={formData.description || ''}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-400 resize-none"
                                        placeholder="Brief description of the item..."
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em] px-1">Product Image</label>
                                    <div className="relative border-2 border-dashed border-slate-200 rounded-2xl hover:border-primary transition-colors bg-slate-50 overflow-hidden group">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        {imagePreview ? (
                                            <div className="relative w-full h-48 flex items-center justify-center bg-black/50">
                                                <img src={imagePreview} alt="Preview" className="max-h-full max-w-full object-contain" />
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                    <div className="flex flex-col items-center text-white">
                                                        <Upload className="w-8 h-8 mb-2" />
                                                        <span className="text-sm font-bold">Change Image</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-10 text-slate-800 group-hover:text-primary transition-colors">
                                                <ImageIcon className="w-10 h-10 mb-3" />
                                                <p className="text-sm font-bold text-slate-800 mb-1">Click or drag image to upload</p>
                                                <p className="text-xs text-slate-800 opacity-70">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-200 flex gap-4 shrink-0">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save className="w-5 h-5" />
                                    <span>{isSubmitting ? 'Saving...' : 'Save Item'}</span>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return createPortal(modalContent, document.body);
};
