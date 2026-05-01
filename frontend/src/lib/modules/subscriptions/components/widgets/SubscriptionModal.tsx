'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Building2, CreditCard, Mail, Package as PackageIcon, Phone, User, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { subscriptionService } from '../../services/subscription.service';
import { CompanySubscription, CompanySubsPackage, SubscriptionPayload } from '../../types';

interface SubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (values: SubscriptionPayload) => Promise<void>;
    subscription?: CompanySubscription | null;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    subscription
}) => {
    const [packages, setPackages] = useState<CompanySubsPackage[]>([]);
    const [isLoadingPackages, setIsLoadingPackages] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState<SubscriptionPayload>({
        full_name: '',
        business_email: '',
        phone_number: '',
        company_name: '',
        package_id: 0,
        payment_method: 0,
    });

    useEffect(() => {
        if (isOpen) {
            fetchPackages();
            if (subscription) {
                setFormData({
                    full_name: subscription.full_name,
                    business_email: subscription.business_email,
                    phone_number: subscription.phone_number,
                    company_name: subscription.company_name,
                    package_id: subscription.package_id,
                    payment_method: subscription.payment_method,
                });
            } else {
                setFormData({
                    full_name: '',
                    business_email: '',
                    phone_number: '',
                    company_name: '',
                    package_id: 0,
                    payment_method: 0,
                });
            }
        }
    }, [isOpen, subscription]);

    const fetchPackages = async () => {
        setIsLoadingPackages(true);
        try {
            const res = await subscriptionService.getPackages();
            if (res.status === 'success' || res.status === 'Success') {
                setPackages(res.data.result);
                if (!subscription && res.data.result.length > 0) {
                    setFormData((prev: SubscriptionPayload) => ({ ...prev, package_id: res.data.result[0].id }));
                }
            }
        } catch (error) {
            console.error('Failed to fetch packages:', error);
        } finally {
            setIsLoadingPackages(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Submit failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-2xl bg-background-dark border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/2">
                            <div>
                                <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">
                                    {subscription ? 'Modify Subscription' : 'New Subscription'}
                                </h2>
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Configure company license parameters</p>
                            </div>
                            <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors bg-white/5 rounded-xl">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Company Info */}
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Company Details</h3>
                                    <div className="space-y-4">
                                        <div className="relative group">
                                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-primary transition-colors" />
                                            <input
                                                required
                                                type="text"
                                                placeholder="Company Name"
                                                value={formData.company_name}
                                                onChange={e => setFormData({ ...formData, company_name: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-inner"
                                            />
                                        </div>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-primary transition-colors" />
                                            <input
                                                required
                                                type="text"
                                                placeholder="Full Name / Owner"
                                                value={formData.full_name}
                                                onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-inner"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Contact Information</h3>
                                    <div className="space-y-4">
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-primary transition-colors" />
                                            <input
                                                required
                                                type="email"
                                                placeholder="Business Email"
                                                value={formData.business_email}
                                                onChange={e => setFormData({ ...formData, business_email: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-inner"
                                            />
                                        </div>
                                        <div className="relative group">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-primary transition-colors" />
                                            <input
                                                required
                                                type="text"
                                                placeholder="Phone Number"
                                                value={formData.phone_number}
                                                onChange={e => setFormData({ ...formData, phone_number: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-inner"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Package Selection */}
                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Subscription Package</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {packages.map((pkg) => (
                                        <div
                                            key={pkg.id}
                                            onClick={() => setFormData({ ...formData, package_id: pkg.id })}
                                            className={cn(
                                                "p-4 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden group",
                                                formData.package_id === pkg.id
                                                    ? "bg-primary/10 border-primary shadow-lg shadow-primary/10"
                                                    : "bg-white/5 border-white/5 hover:border-white/10"
                                            )}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-bold text-white text-sm">{pkg.name}</span>
                                                <PackageIcon className={cn("w-4 h-4", formData.package_id === pkg.id ? "text-primary" : "text-gray-600")} />
                                            </div>
                                            <div className="text-xs text-gray-400 mb-2 line-clamp-1">{pkg.description}</div>
                                            <div className="text-lg font-black text-white italic">Rp {pkg.pricing.toLocaleString()}</div>
                                            {formData.package_id === pkg.id && (
                                                <div className="absolute top-0 right-0 w-8 h-8 bg-primary text-white flex items-center justify-center rounded-bl-xl">
                                                    <CheckCircle className="w-4 h-4" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Payment Method</h3>
                                <div className="flex gap-4">
                                    {[0, 1].map((method) => (
                                        <button
                                            key={method}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, payment_method: method })}
                                            className={cn(
                                                "flex-1 p-4 rounded-2xl border-2 transition-all flex items-center gap-3 font-bold text-sm",
                                                formData.payment_method === method
                                                    ? "bg-primary/10 border-primary text-white"
                                                    : "bg-white/5 border-white/5 text-gray-400 hover:text-white"
                                            )}
                                        >
                                            <CreditCard className="w-5 h-5" />
                                            {method === 0 ? 'Bank Transfer' : 'QRIS / Digital'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </form>

                        {/* Footer */}
                        <div className="p-8 border-t border-white/5 bg-white/2 flex gap-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-4 bg-white/5 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting || formData.package_id === 0}
                                className="flex-[2] px-6 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Processing...' : subscription ? 'Save Changes' : 'Confirm Subscription'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

// Helper component for package selection icon
const CheckCircle = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
    </svg>
);
