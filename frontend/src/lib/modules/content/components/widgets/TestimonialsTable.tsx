import React from 'react';
import { motion } from 'framer-motion';
import { Star, Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { getTestimonialColumns } from '../../constants/columns';
import { LandingTestimonial } from '../../types';

interface TestimonialsTableProps {
    data: LandingTestimonial[];
    onEdit: (item: LandingTestimonial) => void;
    onDelete: (item: LandingTestimonial) => void;
    onAdd: () => void;
}

export const TestimonialsTable = ({ data, onEdit, onDelete, onAdd }: TestimonialsTableProps) => {
    return (
        <motion.div
            key="testimonials"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            <PageHeader
                title="Customer Testimonials"
                subtitle="Manage social proof and client feedback"
                actions={
                    <button
                        onClick={onAdd}
                        className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-primary/20 hover:scale-[1.02]"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Add Testimonial</span>
                    </button>
                }
            />

            <DataTable
                columns={getTestimonialColumns(onEdit, onDelete)}
                data={data}
                page={1}
                onPageChange={() => { }}
            />
        </motion.div>
    );
};
