'use client';

import React, { useState, useEffect } from 'react';
import { X, Building2, Mail, Phone, MapPin, Calendar, ShieldCheck, CreditCard, ImageIcon } from 'lucide-react';
import { Company } from '@/lib/modules/users/types';
import { cn } from '@/lib/utils';
import { apiRouter } from '@/lib/api/router';
import { useToast } from '@/components/ui/Toast';

interface SubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    company: Company | null;
    onSaveSuccess: () => void;
}

export const SubscriptionModal = ({ isOpen, onClose, company, onSaveSuccess }: SubscriptionModalProps) => {
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<Company>>({
        name: '',
        email: '',
        phone: '',
        address: '',
        subscription_plan: 'basic',
        subscription_status: 'inactive',
        valid_until: '',
        payment_proof_url: ''
    });

    useEffect(() => {
        if (company) {
            setFormData({
                ...company,
                valid_until: company.valid_until ? new Date(company.valid_until).toISOString().split('T')[0] : ''
            });
        } else {
            setFormData({
                name: '',
                email: '',
                phone: '',
                address: '',
                subscription_plan: 'basic',
                subscription_status: 'inactive',
                valid_until: '',
                payment_proof_url: ''
            });
        }
    }, [company, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (company) {
                await apiRouter.put(`/companies/${company.id}`, formData);
                showToast('Subscription updated successfully', 'success');
            } else {
                await apiRouter.post('/companies', formData);
                showToast('Subscription created successfully', 'success');
            }
            onSaveSuccess();
            onClose();
        } catch (error: any) {
            showToast(error.response?.data?.message || 'Failed to save subscription', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-background-dark border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/2">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        {company ? <ShieldCheck className="w-6 h-6 text-primary" /> : <Building2 className="w-6 h-6 text-primary" />}
                        {company ? 'Edit Subscription' : 'New Subscription'}
                    </h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Company Info */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Company Name</label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        required
                                        type="text"
                                        placeholder="Company Name"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-500"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        required
                                        type="email"
                                        placeholder="company@email.com"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-500"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Phone</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="text"
                                        placeholder="081..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-500"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Subscription Info */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Plan</label>
                                <select
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                                    value={formData.subscription_plan}
                                    onChange={(e) => setFormData({ ...formData, subscription_plan: e.target.value as any })}
                                >
                                    <option value="basic" className="bg-background-dark text-white">Basic</option>
                                    <option value="recommended" className="bg-background-dark text-white">Recommended</option>
                                    <option value="expert" className="bg-background-dark text-white">Expert</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Status</label>
                                <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, subscription_status: 'active' })}
                                        className={cn(
                                            "flex-1 py-1 text-[10px] font-black uppercase tracking-tighter rounded transition-all",
                                            formData.subscription_status === 'active' ? "bg-emerald-500 text-white shadow-lg" : "text-gray-500 hover:text-white"
                                        )}
                                    >
                                        Active
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, subscription_status: 'pending' })}
                                        className={cn(
                                            "flex-1 py-1 text-[10px] font-black uppercase tracking-tighter rounded transition-all",
                                            formData.subscription_status === 'pending' ? "bg-amber-500 text-white shadow-lg" : "text-gray-500 hover:text-white"
                                        )}
                                    >
                                        Pending
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, subscription_status: 'inactive' })}
                                        className={cn(
                                            "flex-1 py-1 text-[10px] font-black uppercase tracking-tighter rounded transition-all",
                                            formData.subscription_status === 'inactive' ? "bg-red-500 text-white shadow-lg" : "text-gray-500 hover:text-white"
                                        )}
                                    >
                                        Inactive
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Valid Until</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="date"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all scheme-dark"
                                        value={formData.valid_until}
                                        onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                                <textarea
                                    rows={3}
                                    placeholder="Business full address..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-500"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Payment Proof URL</label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                                <textarea
                                    rows={3}
                                    placeholder="Image URL of payment proof..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-500"
                                    value={formData.payment_proof_url}
                                    onChange={(e) => setFormData({ ...formData, payment_proof_url: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-white/5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-white/10 rounded-xl text-white font-bold hover:bg-white/5 transition-all text-sm uppercase tracking-widest"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-black shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 text-sm uppercase tracking-widest"
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
