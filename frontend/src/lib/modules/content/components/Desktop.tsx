'use client';

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { CustomTabs } from '@/components/ui/tabs/CustomTabs';
import { LandingFaq, LandingPackage, LandingTestimonial, ContentSection } from '../types';
import { ContentHeader } from './widgets/ContentHeader';
import { HeroSectionEditor } from './widgets/HeroSectionEditor';
import { TestimonialsTable } from './widgets/TestimonialsTable';
import { PackagesTable } from './widgets/PackagesTable';
import { FaqTable } from './widgets/FaqTable';

interface DesktopProps {
    activeSection: string;
    setActiveSection: (id: string) => void;
    sections: ContentSection[];
    packages: LandingPackage[];
    testimonials: LandingTestimonial[];
    faqs: LandingFaq[];
    isLoading: boolean;
    onEditPackage: (item: LandingPackage) => void;
    onDeletePackage: (item: LandingPackage) => void;
    onAddPackage: () => void;
    onEditTestimonial: (item: LandingTestimonial) => void;
    onDeleteTestimonial: (item: LandingTestimonial) => void;
    onAddTestimonial: () => void;
    onEditFaq: (item: LandingFaq) => void;
    onDeleteFaq: (item: LandingFaq) => void;
    onAddFaq: () => void;
}

export const Desktop = ({
    activeSection,
    setActiveSection,
    sections,
    packages,
    testimonials,
    faqs,
    isLoading,
    onEditPackage,
    onDeletePackage,
    onAddPackage,
    onEditTestimonial,
    onDeleteTestimonial,
    onAddTestimonial,
    onEditFaq,
    onDeleteFaq,
    onAddFaq
}: DesktopProps) => {

    return (
        <div className="space-y-8">
            {/* Header Area */}
            <ContentHeader />

            {/* Navigation Tabs */}
            <CustomTabs
                tabs={sections}
                activeTab={activeSection}
                onChange={setActiveSection}
            />

            {/* Content Editor Area */}
            <div className="mx-auto w-full pb-20">
                <AnimatePresence mode="wait">
                    {activeSection === 'hero' && (
                        <HeroSectionEditor />
                    )}

                    {activeSection === 'testimonials' && (
                        <TestimonialsTable
                            data={testimonials}
                            onEdit={onEditTestimonial}
                            onDelete={onDeleteTestimonial}
                            onAdd={onAddTestimonial}
                        />
                    )}

                    {activeSection === 'packages' && (
                        <PackagesTable
                            data={packages}
                            onEdit={onEditPackage}
                            onDelete={onDeletePackage}
                            onAdd={onAddPackage}
                        />
                    )}

                    {activeSection === 'faq' && (
                        <FaqTable
                            data={faqs}
                            onEdit={onEditFaq}
                            onDelete={onDeleteFaq}
                            onAdd={onAddFaq}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
