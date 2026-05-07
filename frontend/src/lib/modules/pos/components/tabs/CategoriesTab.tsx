import React, { useState, useEffect, useCallback } from 'react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { PosCategory } from '../../types';
import { posService } from '../../services/pos.service';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { PaginationData } from '@/lib/modules/users/types';

interface CategoriesTabProps {
    companyId: number;
}

export const CategoriesTab: React.FC<CategoriesTabProps> = ({ companyId }) => {
    const [categories, setCategories] = useState<PosCategory[]>([]);
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);

    const fetchCategories = useCallback(async () => {
        if (!companyId) return;
        setIsLoading(true);
        try {
            const response = await posService.getCategories(companyId, { page, limit: 10 });
            if (response.status === 'success' || response.status === 'Success') {
                setCategories(response.data.categories);
                setPagination(response.data.pagination);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally {
            setIsLoading(false);
        }
    }, [companyId, page]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const columns: Column<PosCategory>[] = [
        { header: 'Category Name', accessorKey: 'name', sortable: true },
        { header: 'Description', accessorKey: 'description' },
        { 
            header: 'Status', 
            accessorKey: 'is_active',
            cell: (cat) => (
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${cat.is_active ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                    {cat.is_active ? 'Active' : 'Inactive'}
                </span>
            )
        },
        {
            header: 'Actions',
            align: 'right',
            cell: (item) => (
                <div className="flex justify-end gap-2">
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-white uppercase italic tracking-wider">Categories</h3>
                    <p className="text-xs text-gray-500">Organize your products into logical groups.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20">
                    <Plus className="w-4 h-4" />
                    <span>Add New Category</span>
                </button>
            </div>

            <DataTable
                columns={columns}
                data={categories}
                isLoading={isLoading}
                pagination={pagination}
                page={page}
                onPageChange={setPage}
            />
        </div>
    );
};
