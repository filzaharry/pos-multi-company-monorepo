import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { AnimatePresence, motion } from 'framer-motion';
import { FileText, Hash, Package as PackageIcon, Plus, Upload, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { subscriptionService } from '../../services/subscription.service';
import { CompanyHeader, CompanySubsPackage } from '../../types';
import { SectionTitle } from './SectionTitle';

interface CreatePaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    company: CompanyHeader;
    onSuccess?: () => void;
}

export const CreatePaymentModal: React.FC<CreatePaymentModalProps> = ({ isOpen, onClose, company, onSuccess }) => {
    const { showToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [packages, setPackages] = useState<CompanySubsPackage[]>([]);

    const [selectedPackage, setSelectedPackage] = useState<number | ''>('');
    const [paymentMethod, setPaymentMethod] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(1);
    const [receiptFile, setReceiptFile] = useState<File | null>(null);

    useEffect(() => {
        if (isOpen) {
            setSelectedPackage('');
            setPaymentMethod(0);
            setQuantity(1);
            setReceiptFile(null);
            fetchPackages();
        }
    }, [isOpen]);

    const fetchPackages = async () => {
        try {
            const res = await subscriptionService.getPackages();
            if (res.status === 'success' || res.status === 'Success') {
                setPackages(res.data.result);
            }
        } catch (error) {
            console.error('Failed to fetch packages:', error);
        }
    };

    const handleSubmit = async () => {
        if (selectedPackage === '') {
            showToast('Please select a package', 'error');
            return;
        }

        if (quantity < 1) {
            showToast('Quantity must be at least 1', 'error');
            return;
        }

        if (!receiptFile) {
            showToast('Please upload a proof of payment', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            // Loop and create multiple subscriptions if quantity > 1
            for (let i = 0; i < quantity; i++) {
                const formData = new FormData();
                formData.append('company_id', String(company.id));
                formData.append('full_name', company.name);
                formData.append('business_email', company.email || '');
                formData.append('phone_number', company.phone || '');
                formData.append('company_name', company.name);
                formData.append('route', company.route || '');
                formData.append('package_id', String(selectedPackage));
                formData.append('payment_method', String(paymentMethod));
                formData.append('payment_status', '0'); // Pending
                if (receiptFile) formData.append('payment_receipt', receiptFile);

                await subscriptionService.createSubscription(formData);
            }

            showToast(`Successfully created ${quantity} pending payment(s)`, 'success');
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to create payment:', error);
            showToast('Failed to create payment', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <div key="create-payment-modal" className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                    >
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">Create New Payment</h3>
                            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="space-y-4">
                                <SectionTitle icon={PackageIcon} title="Subscription Details" />

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Package</label>
                                    <select
                                        value={selectedPackage}
                                        onChange={(e) => setSelectedPackage(Number(e.target.value))}
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                                    >
                                        <option value="" disabled>Select a package...</option>
                                        {packages.map(pkg => (
                                            <option key={pkg.id} value={pkg.id}>
                                                {pkg.name} - Rp {pkg.pricing.toLocaleString('id-ID')} ({pkg.duration_days} days)
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Payment Method</label>
                                    <select
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(Number(e.target.value))}
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                                    >
                                        <option value={0}>Bank Transfer</option>
                                        <option value={1}>QRIS / E-Wallet</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Quantity (Multiplies Subscription)</label>
                                    <div className="relative">
                                        <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="number"
                                            min="1"
                                            value={quantity}
                                            onChange={(e) => setQuantity(Number(e.target.value))}
                                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                                            placeholder="e.g. 5"
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                                        This will create {quantity} separate pending payment(s). You can approve them sequentially to extend the subscription duration.
                                    </p>
                                </div>

                                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                                    <label className="text-xs font-bold text-slate-700">Proof of Payment</label>
                                    <div className="flex items-center gap-4">
                                        <label className="flex-1 border-2 border-dashed border-slate-200 hover:border-primary/50 bg-slate-50 hover:bg-primary/5 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group">
                                            <Upload className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
                                            <div className="text-center">
                                                <p className="text-xs font-bold text-slate-600 group-hover:text-primary transition-colors">
                                                    Click to upload receipt
                                                </p>
                                                <p className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, PDF up to 5MB</p>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*,application/pdf"
                                                hidden
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) setReceiptFile(file);
                                                }}
                                            />
                                        </label>

                                        {receiptFile && (
                                            <div className="w-24 h-24 flex-shrink-0 border border-slate-200 rounded-xl overflow-hidden bg-slate-50 flex flex-col items-center justify-center relative group">
                                                {receiptFile.type.includes('image') ? (
                                                    <img src={URL.createObjectURL(receiptFile)} alt="Receipt" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="flex flex-col items-center p-2 text-center">
                                                        <FileText className="w-6 h-6 text-blue-500 mb-1" />
                                                        <span className="text-[8px] font-bold text-slate-600 truncate w-full">{receiptFile.name}</span>
                                                    </div>
                                                )}
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setReceiptFile(null);
                                                    }}
                                                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-6 h-6 text-white" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <Button variant="primary" size="sm" icon={Plus} isLoading={isSubmitting} onClick={handleSubmit}>
                                Create Payment
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
