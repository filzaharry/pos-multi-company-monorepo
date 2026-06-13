import React from 'react';
import { motion } from 'framer-motion';
import { Layout as LayoutIcon, Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { getFaqColumns } from '../../constants/columns';
import { LandingFaq } from '../../types';

interface FaqTableProps {
    data: LandingFaq[];
    onEdit: (item: LandingFaq) => void;
    onDelete: (item: LandingFaq) => void;
    onAdd: () => void;
}

export const FaqTable = ({ data, onEdit, onDelete, onAdd }: FaqTableProps) => {
    return (
        <motion.div
            key="faq"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            <PageHeader
                title="FAQ & Others"
                subtitle="Manage frequently asked questions"
                actions={
                    <button
                        onClick={onAdd}
                        className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-primary/20 hover:scale-[1.02]"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Add FAQ</span>
                    </button>
                }
            />

            <DataTable
                columns={getFaqColumns(onEdit, onDelete)}
                data={data}
                page={1}
                onPageChange={() => { }}
            />
        </motion.div>
    );
};
