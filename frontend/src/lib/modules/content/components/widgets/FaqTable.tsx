import React from 'react';
import { motion } from 'framer-motion';
import { Layout as LayoutIcon, Plus } from 'lucide-react';
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
            <div className="flex justify-between items-center px-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                        <LayoutIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-white uppercase italic">FAQ <span className="text-primary">& Others</span></h3>
                        <p className="text-gray-500 text-xs font-medium uppercase tracking-widest">Manage frequently asked questions</p>
                    </div>
                </div>
                <button 
                    onClick={onAdd}
                    className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-primary/20 hover:scale-[1.02]"
                >
                    <Plus className="w-5 h-5" /> 
                    <span>Add FAQ</span>
                </button>
            </div>
            
            <DataTable 
                columns={getFaqColumns(onEdit, onDelete)}
                data={data}
                page={1}
                onPageChange={() => {}}
            />
        </motion.div>
    );
};
