import React, { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Desktop } from './Desktop';
import { Type, Box, Star, Layout as LayoutIcon, AlertCircle } from 'lucide-react';
import { contentService } from '../services/content.service';
import { LandingFaq, LandingPackage, LandingTestimonial } from '../types';
import { useToast } from '@/components/ui/Toast';
import { PackageModal } from './widgets/PackageModal';
import { TestimonialModal } from './widgets/TestimonialModal';
import { FaqModal } from './widgets/FaqModal';
import { motion, AnimatePresence } from 'framer-motion';

export const Layout = () => {
    const { showToast } = useToast();
    const [activeSection, setActiveSection] = useState('hero');

    // Data State
    const [packages, setPackages] = useState<LandingPackage[]>([]);
    const [testimonials, setTestimonials] = useState<LandingTestimonial[]>([]);
    const [faqs, setFaqs] = useState<LandingFaq[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal State
    const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
    const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
    const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<LandingPackage | LandingTestimonial | LandingFaq | null>(null);

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<LandingPackage | LandingTestimonial | LandingFaq | null>(null);
    const [deleteType, setDeleteType] = useState<'package' | 'testimonial' | 'faq' | null>(null);

    const sections = [
        { id: 'hero', icon: Type, label: 'Header / Hero' },
        { id: 'packages', icon: Box, label: 'Packages' },
        { id: 'testimonials', icon: Star, label: 'Testimonials' },
        { id: 'faq', icon: LayoutIcon, label: 'FAQ & Others' },
    ];

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [pkgRes, testRes, faqRes] = await Promise.all([
                contentService.getPackages(),
                contentService.getTestimonials(),
                contentService.getFaqs()
            ]);

            interface PaginatedResponse<T> {
                data: T[];
            }

            if (pkgRes.status.toLowerCase() === 'success') {
                const pkgData = pkgRes.data.result;
                setPackages(Array.isArray(pkgData) ? pkgData : (pkgData as PaginatedResponse<LandingPackage>).data || []);
            }
            if (testRes.status.toLowerCase() === 'success') {
                const testData = testRes.data.result;
                setTestimonials(Array.isArray(testData) ? testData : (testData as PaginatedResponse<LandingTestimonial>).data || []);
            }
            if (faqRes.status.toLowerCase() === 'success') {
                const faqData = faqRes.data.result;
                setFaqs(Array.isArray(faqData) ? faqData : (faqData as PaginatedResponse<LandingFaq>).data || []);
            }
        } catch (error) {
            console.error('Failed to fetch content data:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Handlers for Package
    const handlePackageSubmit = async (values: Partial<LandingPackage>) => {
        try {
            if (selectedItem) {
                await contentService.updatePackage(selectedItem.id, values);
                showToast('Package updated successfully', 'success');
            } else {
                await contentService.createPackage(values);
                showToast('Package created successfully', 'success');
            }
            fetchData();
        } catch (error) {
            console.error('Package submit error:', error);
            showToast('Failed to save package', 'error');
        }
    };

    // Handlers for Testimonial
    const handleTestimonialSubmit = async (values: Partial<LandingTestimonial>) => {
        try {
            if (selectedItem) {
                await contentService.updateTestimonial(selectedItem.id, values);
                showToast('Testimonial updated successfully', 'success');
            } else {
                await contentService.createTestimonial(values);
                showToast('Testimonial added successfully', 'success');
            }
            fetchData();
        } catch (error) {
            console.error('Testimonial submit error:', error);
            showToast('Failed to save testimonial', 'error');
        }
    };

    // Handlers for FAQ
    const handleFaqSubmit = async (values: Partial<LandingFaq>) => {
        try {
            if (selectedItem) {
                await contentService.updateFaq(selectedItem.id, values);
                showToast('FAQ updated successfully', 'success');
            } else {
                await contentService.createFaq(values);
                showToast('FAQ added successfully', 'success');
            }
            fetchData();
        } catch (error) {
            console.error('FAQ submit error:', error);
            showToast('Failed to save FAQ', 'error');
        }
    };

    const confirmDelete = async () => {
        if (!itemToDelete || !deleteType) return;
        try {
            if (deleteType === 'package') await contentService.deletePackage(itemToDelete.id);
            else if (deleteType === 'testimonial') await contentService.deleteTestimonial(itemToDelete.id);
            else if (deleteType === 'faq') await contentService.deleteFaq(itemToDelete.id);

            showToast(`${deleteType.charAt(0).to() + deleteType.slice(1)} deleted successfully`, 'success');
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
            setDeleteType(null);
            fetchData();
        } catch (error) {
            console.error('Delete failed:', error);
            showToast('Delete operation failed', 'error');
        }
    };

    return (
        <DashboardLayout>
            <Desktop
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                sections={sections}
                packages={packages}
                testimonials={testimonials}
                faqs={faqs}
                isLoading={isLoading}
                onEditPackage={(item) => { setSelectedItem(item); setIsPackageModalOpen(true); }}
                onDeletePackage={(item) => { setItemToDelete(item); setDeleteType('package'); setIsDeleteModalOpen(true); }}
                onAddPackage={() => { setSelectedItem(null); setIsPackageModalOpen(true); }}

                onEditTestimonial={(item) => { setSelectedItem(item); setIsTestimonialModalOpen(true); }}
                onDeleteTestimonial={(item) => { setItemToDelete(item); setDeleteType('testimonial'); setIsDeleteModalOpen(true); }}
                onAddTestimonial={() => { setSelectedItem(null); setIsTestimonialModalOpen(true); }}

                onEditFaq={(item) => { setSelectedItem(item); setIsFaqModalOpen(true); }}
                onDeleteFaq={(item) => { setItemToDelete(item); setDeleteType('faq'); setIsDeleteModalOpen(true); }}
                onAddFaq={() => { setSelectedItem(null); setIsFaqModalOpen(true); }}
            />

            <PackageModal
                isOpen={isPackageModalOpen}
                onClose={() => setIsPackageModalOpen(false)}
                onSubmit={handlePackageSubmit}
                item={selectedItem as LandingPackage}
            />

            <TestimonialModal
                isOpen={isTestimonialModalOpen}
                onClose={() => setIsTestimonialModalOpen(false)}
                onSubmit={handleTestimonialSubmit}
                item={selectedItem as LandingTestimonial}
            />

            <FaqModal
                isOpen={isFaqModalOpen}
                onClose={() => setIsFaqModalOpen(false)}
                onSubmit={handleFaqSubmit}
                item={selectedItem as LandingFaq}
            />

            <AnimatePresence>
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-md bg-background-dark border border-white/10 rounded-3xl p-8 shadow-2xl text-center">
                            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                                <AlertCircle className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Delete Item?</h3>
                            <p className="text-gray-400 mb-8">Are you sure you want to delete this {deleteType}?</p>
                            <div className="flex gap-4">
                                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-6 py-3 bg-white/5 text-white rounded-xl font-bold transition-all">Cancel</button>
                                <button onClick={confirmDelete} className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-500/20">Yes, Delete</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
};
