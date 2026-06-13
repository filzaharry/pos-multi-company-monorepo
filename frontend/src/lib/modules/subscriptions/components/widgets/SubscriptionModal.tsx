import { ImagePreview } from '@/components/ui/image-preview/ImagePreview';
import { InputText } from '@/components/ui/input/InputText';
import { InputDisabled } from '@/components/ui/input/InputDisabled';
import { BaseModal } from '@/components/ui/modal';
import { cn, getImageUrl } from '@/lib/utils';
import { Building2, Calendar, CheckCircle, CreditCard, Eye, History, Link, Loader2, LucideIcon, Mail, Package as PackageIcon, Phone, ShieldAlert, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
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
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const [formData, setFormData] = useState<SubscriptionPayload>({
        full_name: '',
        business_email: '',
        phone_number: '',
        company_name: '',
        package_id: 0,
        payment_method: 0,
        payment_status: 0,
        payment_receipt: '',
        route: ''
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
                    payment_receipt: subscription.payment_receipt,
                    route: subscription.route || ''
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
                    payment_receipt: '',
                    route: ''
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
                            className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
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
                    {/* Removed Business and Contact Details */}

                    {/* Receipt Section */}
                    {formData.payment_receipt && (
                        <div className="space-y-4 pt-6 border-t border-white/5">
                            <SectionTitle icon={CreditCard} title="Payment Receipt" />
                            <div
                                onClick={() => setIsPreviewOpen(true)}
                                className="relative aspect-video rounded-3xl overflow-hidden border border-slate-200 hover:border-primary/50 transition-all cursor-zoom-in group bg-slate-50"
                            >
                                <img
                                    src={getImageUrl(formData.payment_receipt)!}
                                    className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.02]"
                                    alt="Receipt"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                    <div className="bg-slate-900/60 backdrop-blur-xl px-6 py-3 rounded-2xl text-white  font-bold text-xs border border-slate-800/20 flex items-center gap-2">
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
                            <InputDisabled
                                label="Selected Plan"
                                value={`${packages.find(p => p.id === formData.package_id)?.name || 'Standard Plan'} (Billed Annually)`}
                                icon={PackageIcon}
                            />
                            {subscription?.start_date && subscription?.end_date && (
                                <InputDisabled
                                    label="Active Period"
                                    value={`${moment(subscription.start_date).format('DD MMM YYYY')} - ${moment(subscription.end_date).format('DD MMM YYYY')}`}
                                    icon={Calendar}
                                />
                            )}
                        </div>
                        <div className="space-y-4">
                            <SectionTitle icon={CreditCard} title="Payment Method" />
                            <InputDisabled
                                label="Method"
                                value={formData.payment_method === 0 ? 'Bank Transfer' : 'QRIS / Digital'}
                                icon={CreditCard}
                            />
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
                                        "p-3 rounded-xl border transition-all flex items-center justify-center gap-2 relative overflow-hidden group",
                                        formData.payment_status === s.id
                                            ? `${s.bg} ${s.border} ${s.color} border-current font-bold shadow-sm`
                                            : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800 font-medium"
                                    )}
                                >
                                    <s.icon className={cn("w-4 h-4", formData.payment_status === s.id ? s.color : "opacity-40 group-hover:opacity-100")} />
                                    <span className="text-sm">{s.label}</span>
                                    {formData.payment_status === s.id && (
                                        <div className="absolute top-1.5 right-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
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
                    images={[getImageUrl(formData.payment_receipt)!]}
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
        <h3 className="text-[10px] font-bold text-primary   tracking-[0.2em]">{title}</h3>
    </div>
);

