import { cn } from '@/lib/utils';
import { Building2, CreditCard, Mail, Package as PackageIcon, Phone, User, CheckCircle, Loader2, Eye, ShieldAlert, History, LucideIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { subscriptionService } from '../../services/subscription.service';
import { CompanySubscription, CompanySubsPackage, SubscriptionPayload } from '../../types';
import { BaseModal } from '@/components/ui/modal';
import { ImagePreview } from '@/components/ui/image-preview/ImagePreview';

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
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const [formData, setFormData] = useState<SubscriptionPayload>({
        full_name: '',
        business_email: '',
        phone_number: '',
        company_name: '',
        package_id: 0,
        payment_method: 0,
        payment_status: 0,
        payment_receipt: ''
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
                    payment_status: subscription.payment_status,
                    payment_receipt: subscription.payment_receipt
                });
            } else {
                setFormData({
                    full_name: '',
                    business_email: '',
                    phone_number: '',
                    company_name: '',
                    package_id: 0,
                    payment_method: 0,
                    payment_status: 0,
                    payment_receipt: ''
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

    const isEdit = !!subscription;

    return (
        <>
            <BaseModal
                isOpen={isOpen}
                onClose={onClose}
                title={isEdit ? 'Manage Subscription' : 'New Subscription'}
                description={isEdit ? 'Review and update subscription status' : 'Configure company license parameters'}
                size="2xl"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting || formData.package_id === 0}
                            className="flex items-center gap-2 px-8 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                        >
                            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            <span>{isEdit ? 'Update Status' : 'Confirm Subscription'}</span>
                        </button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Read-only Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <SectionTitle icon={Building2} title="Business Details" />
                            <div className="space-y-4">
                                <InfoField label="Company Name" value={formData.company_name} icon={Building2} />
                                <InfoField label="Owner Name" value={formData.full_name} icon={User} />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <SectionTitle icon={Mail} title="Contact Info" />
                            <div className="space-y-4">
                                <InfoField label="Email" value={formData.business_email} icon={Mail} />
                                <InfoField label="Phone" value={formData.phone_number} icon={Phone} />
                            </div>
                        </div>
                    </div>

                    {/* Receipt Section */}
                    {formData.payment_receipt && (
                        <div className="space-y-4 pt-6 border-t border-white/5">
                            <SectionTitle icon={CreditCard} title="Payment Receipt" />
                            <div 
                                onClick={() => setIsPreviewOpen(true)}
                                className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all cursor-zoom-in group bg-white/2"
                            >
                                <img 
                                    src={formData.payment_receipt} 
                                    className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.02]" 
                                    alt="Receipt" 
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                    <div className="bg-white/10 backdrop-blur-xl px-6 py-3 rounded-2xl text-white font-black uppercase tracking-widest text-xs border border-white/20 flex items-center gap-2">
                                        <Eye className="w-4 h-4" />
                                        <span>Preview Receipt</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Package & Payment Summary (Read Only if Edit) */}
                    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/5", isEdit && "opacity-80")}>
                        <div className="space-y-4">
                            <SectionTitle icon={PackageIcon} title="Plan Details" />
                            <div className="p-4 bg-white/2 border border-white/10 rounded-2xl">
                                <p className="text-white font-bold">{packages.find(p => p.id === formData.package_id)?.name || 'Standard Plan'}</p>
                                <p className="text-xs text-gray-500 mt-1 uppercase font-black tracking-tighter">Billed Annually</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <SectionTitle icon={CreditCard} title="Payment Method" />
                            <div className="p-4 bg-white/2 border border-white/10 rounded-2xl flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <CreditCard className="w-4 h-4 text-primary" />
                                </div>
                                <span className="text-white font-bold">{formData.payment_method === 0 ? 'Bank Transfer' : 'QRIS / Digital'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Status Update (Primary Action) */}
                    <div className="space-y-6 pt-6 border-t border-white/5">
                        <SectionTitle icon={History} title="Update Payment Status" />
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                { id: 0, label: 'Pending', icon: Loader2, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
                                { id: 1, label: 'Success', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' },
                                { id: 2, label: 'Failed', icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' }
                            ].map((s) => (
                                <button
                                    key={s.id}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, payment_status: s.id })}
                                    className={cn(
                                        "p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 relative overflow-hidden group",
                                        formData.payment_status === s.id
                                            ? `${s.bg} ${s.border} ${s.color} border-current`
                                            : "bg-white/2 border-white/5 text-gray-500 hover:border-white/10 hover:text-white"
                                    )}
                                >
                                    <s.icon className={cn("w-6 h-6", formData.payment_status === s.id ? s.color : "opacity-40 group-hover:opacity-100")} />
                                    <span className="font-black text-[10px] uppercase tracking-[0.2em]">{s.label}</span>
                                    {formData.payment_status === s.id && (
                                        <div className="absolute top-2 right-2">
                                            <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </form>
            </BaseModal>

            {/* Receipt Preview */}
            {formData.payment_receipt && (
                <ImagePreview 
                    isOpen={isPreviewOpen}
                    onClose={() => setIsPreviewOpen(false)}
                    images={[formData.payment_receipt]}
                    initialIndex={0}
                />
            )}
        </>
    );
};

const SectionTitle = ({ icon: Icon, title }: { icon: LucideIcon, title: string }) => (
    <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-primary/10 rounded-lg">
            <Icon className="w-3.5 h-3.5 text-primary" />
        </div>
        <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{title}</h3>
    </div>
);

const InfoField = ({ label, value, icon: Icon }: { label: string, value: string, icon: LucideIcon }) => (
    <div className="relative group">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
        <div className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white/50 cursor-not-allowed">
            <span className="text-[10px] font-medium text-gray-500 absolute top-1 left-12">{label}</span>
            <div className="mt-1">{value || '-'}</div>
        </div>
    </div>
);
