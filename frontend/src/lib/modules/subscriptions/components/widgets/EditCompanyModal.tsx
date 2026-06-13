import React, { useState, useRef, useEffect } from 'react';
import { CompanyHeader } from '../../types';
import { getImageUrl } from '@/lib/utils';
import { Building2, Camera, Link, Mail, Phone, Save, X, LucideIcon } from 'lucide-react';
import { InputText } from '@/components/ui/input/InputText';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { subscriptionService } from '../../services/subscription.service';
import { AnimatePresence, motion } from 'framer-motion';

const SectionTitle = ({ icon: Icon, title }: { icon: LucideIcon, title: string }) => (
    <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-primary/10 rounded-lg">
            <Icon className="w-3.5 h-3.5 text-primary" />
        </div>
        <h3 className="text-[10px] font-bold text-primary   tracking-[0.2em]">{title}</h3>
    </div>
);

interface EditCompanyModalProps {
    isOpen: boolean;
    onClose: () => void;
    company: CompanyHeader;
    onUpdateCompany?: () => void;
}

export const EditCompanyModal: React.FC<EditCompanyModalProps> = ({ isOpen, onClose, company, onUpdateCompany }) => {
    const { showToast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    const [companyName, setCompanyName] = useState(company.name || '');
    const [companyRoute, setCompanyRoute] = useState(company.route || '');
    const [companyEmail, setCompanyEmail] = useState(company.email || '');
    const [companyPhone, setCompanyPhone] = useState(company.phone || '');

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(getImageUrl(company.logo_url));
    const [bannerPreview, setBannerPreview] = useState<string | null>(getImageUrl(company.banner_url));

    const logoInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setCompanyName(company.name || '');
            setCompanyRoute(company.route || '');
            setCompanyEmail(company.email || '');
            setCompanyPhone(company.phone || '');
            setLogoPreview(getImageUrl(company.logo_url));
            setBannerPreview(getImageUrl(company.banner_url));
            setLogoFile(null);
            setBannerFile(null);
        }
    }, [isOpen, company]);

    const handleUpdateCompany = async () => {
        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append('name', companyName);
            formData.append('route', companyRoute);
            formData.append('email', companyEmail);
            formData.append('phone', companyPhone);

            if (logoFile) formData.append('logo', logoFile);
            if (bannerFile) formData.append('banner', bannerFile);

            await subscriptionService.updateCompanyInfo(company.id, formData);

            showToast('Company profile updated successfully', 'success');

            onClose();
            if (onUpdateCompany) onUpdateCompany();
        } catch (error) {
            console.error('Failed to update company:', error);
            showToast('Failed to update company profile', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <div key="edit-modal" className="fixed inset-0 z-[110] flex items-center justify-center p-4">
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
                        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">Edit Profile</h3>
                            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scroll">
                            {/* Photos */}
                            <div className="space-y-4">
                                <SectionTitle icon={Camera} title="Profile Photos" />
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Logo Upload */}
                                    <div
                                        onClick={() => logoInputRef.current?.click()}
                                        className="border-2 border-dashed border-slate-200 hover:border-primary/50 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-slate-50 overflow-hidden border border-slate-100 mb-2">
                                            {logoPreview ? (
                                                <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                    <Building2 className="w-6 h-6" />
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-xs font-bold text-slate-600 group-hover:text-primary">Change Logo</span>
                                        <input type="file" ref={logoInputRef} hidden accept="image/*" onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) { setLogoFile(file); setLogoPreview(URL.createObjectURL(file)); }
                                        }} />
                                    </div>

                                    {/* Banner Upload */}
                                    <div
                                        onClick={() => bannerInputRef.current?.click()}
                                        className="border-2 border-dashed border-slate-200 hover:border-primary/50 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group"
                                    >
                                        <div className="w-full h-16 rounded-lg bg-slate-50 overflow-hidden border border-slate-100 mb-2">
                                            {bannerPreview ? (
                                                <img src={bannerPreview} alt="Banner Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                    <Camera className="w-6 h-6" />
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-xs font-bold text-slate-600 group-hover:text-primary">Change Banner</span>
                                        <input type="file" ref={bannerInputRef} hidden accept="image/*" onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) { setBannerFile(file); setBannerPreview(URL.createObjectURL(file)); }
                                        }} />
                                    </div>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-4">
                                <SectionTitle icon={Building2} title="Company Details" />
                                <InputText label="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} icon={Building2} />
                                <InputText label="Store Route" value={companyRoute} onChange={(e) => setCompanyRoute(e.target.value)} icon={Link} />
                                <InputText label="Email" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} icon={Mail} />
                                <InputText label="Phone" value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} icon={Phone} />
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <Button variant="primary" size="sm" icon={Save} isLoading={isSaving} onClick={handleUpdateCompany}>
                                Save Changes
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
