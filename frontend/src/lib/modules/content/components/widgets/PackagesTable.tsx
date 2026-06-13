import { DataTable } from '@/components/ui/DataTable';
import { motion } from 'framer-motion';
import { Box, Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
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
            <PageHeader
                title="Service Packages"
                subtitle="Manage pricing plans and feature lists"
                actions={
                    <button
                        onClick={onAdd}
                        className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-primary/20 hover:scale-[1.02]"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Add Package</span>
                    </button>
                }
            />

            <DataTable
                columns={getPackageColumns(onEdit, onDelete)}
                data={data}
                page={1}
                onPageChange={() => { }}
            />
        </motion.div>
    );
};
