import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { motion } from 'framer-motion';
import { Eye, Image as ImageIcon, Save, Type, Loader2 } from 'lucide-react';
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
            className="p-10 bg-background-dark/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] shadow-2xl space-y-10"
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                        <Type className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-white uppercase italic">Hero Section <span className="text-primary">Editor</span></h3>
                        <p className="text-gray-500 text-xs font-medium uppercase tracking-widest">Main landing page headline and visuals</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => { window.open('/', '_blank') }}
                        className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-sm font-bold border border-white/10 transition-all">
                        <Eye className="w-4 h-4" />
                        <span>Live Preview</span>
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        <span>Publish Changes</span>
                    </button>
                </div>
            </div>

            <div className="space-y-8">
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Main Headline</label>
                    <Input
                        value={data.title}
                        onChange={(e) => setData({ ...data, title: e.target.value })}
                        placeholder="Enter main headline..."
                    />
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Sub-headline</label>
                    <textarea
                        value={data.subtitle}
                        onChange={(e) => setData({ ...data, subtitle: e.target.value })}
                        className="w-full px-6 py-5 bg-background-dark border border-white/10 rounded-3xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all min-h-[120px] resize-none shadow-inner"
                        placeholder="Streamline your sales and inventory management with our all-in-one POS solution."
                    />
                </div>
                {/* <div className="space-y-3">
                    <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Background Image</label>
                    <div className="p-16 border-2 border-dashed border-white/5 rounded-[2rem] flex flex-col items-center gap-6 group hover:border-primary/50 transition-all cursor-pointer bg-white/2 hover:bg-white/5">
                        <div className="p-6 bg-primary/10 rounded-full text-primary group-hover:scale-110 transition-transform shadow-lg shadow-primary/10">
                            <ImageIcon className="w-10 h-10" />
                        </div>
                        <div className="text-center">
                            <p className="text-base font-black text-white uppercase tracking-tight">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-500 mt-1 font-medium italic">SVG, PNG, JPG (Recommended: 1920x1080px)</p>
                        </div>
                    </div>
                </div> */}
            </div>
        </motion.div>
    );
};
