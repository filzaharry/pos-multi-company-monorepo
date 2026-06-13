import React, { useState, useEffect } from 'react';
import { InputText, InputTextArea } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Eye, Save, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { contentService } from '../../services/content.service';
import { useToast } from '@/components/ui/Toast';

export const HeroSectionEditor = () => {
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [data, setData] = useState({
        title: '',
        subtitle: '',
        image: ''
    });

    useEffect(() => {
        const fetchHeader = async () => {
            try {
                const res = await contentService.getLandingHeader();
                if (res.status.toLowerCase() === 'success') {
                    setData(res.data.result);
                }
            } catch (error) {
                console.error('Failed to fetch hero data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHeader();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await contentService.updateLandingHeader(data);
            if (res.status.toLowerCase() === 'success') {
                showToast('Hero section updated successfully', 'success');
            }
        } catch (error) {
            console.error('Save error:', error);
            showToast('Failed to update hero section', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <motion.div
            key="hero"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            <PageHeader
                title="Hero Section Editor"
                subtitle="Main landing page headline and visuals"
                actions={
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => { window.open('/', '_blank') }}
                            className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-sm font-bold border border-slate-200 transition-all shadow-xs"
                        >
                            <Eye className="w-4 h-4" />
                            <span>Live Preview</span>
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            <span>Publish Changes</span>
                        </button>
                    </div>
                }
            />

            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-6">
                <InputText
                    label="Main Headline"
                    value={data.title}
                    onChange={(e) => setData({ ...data, title: e.target.value })}
                    placeholder="Enter main headline..."
                />
                <InputTextArea
                    label="Sub-headline"
                    value={data.subtitle}
                    onChange={(e) => setData({ ...data, subtitle: e.target.value })}
                    placeholder="Streamline your sales and inventory management with our all-in-one POS solution..."
                />
            </div>
        </motion.div>
    );
};
