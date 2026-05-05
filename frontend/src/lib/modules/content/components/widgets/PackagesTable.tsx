import React from 'react';
import { motion } from 'framer-motion';
import { Box, Plus } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { getPackageColumns } from '../../constants/columns';
import { LandingPackage } from '../../types';

interface PackagesTableProps {
    data: LandingPackage[];
    onEdit: (item: LandingPackage) => void;
    onDelete: (item: LandingPackage) => void;
    onAdd: () => void;
}

export const PackagesTable = ({ data, onEdit, onDelete, onAdd }: PackagesTableProps) => {
    return (
        <motion.div
            key="packages"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            <div className="flex justify-between items-center px-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                        <Box className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-white uppercase italic">Service <span className="text-primary">Packages</span></h3>
                        <p className="text-gray-500 text-xs font-medium uppercase tracking-widest">Manage pricing plans and feature lists</p>
                    </div>
                </div><div className=""></div>
            </div>

            <DataTable
                columns={getPackageColumns(onEdit, onDelete)}
                data={data}
                page={1}
                onPageChange={() => { }}
            />
        </motion.div>
    );
};
