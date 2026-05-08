import React, { useState, useEffect, useCallback } from 'react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { PosCategory } from '../../../types';
import { posService } from '../../../services/pos.service';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { PaginationData } from '@/lib/modules/users/types';
import { CategoryModal } from './components/CategoryModal';
import { useToast } from '@/components/ui/Toast';

interface CategoriesTabProps {
    companyId: number;
}

export const CategoriesTab: React.FC<CategoriesTabProps> = ({ companyId }) => {
    const { showToast } = useToast();
    const [categories, setCategories] = useState<PosCategory[]>([]);
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<PosCategory | null>(null);

    const fetchCategories = useCallback(async () => {
        if (!companyId) return;
        setIsLoading(true);
        try {
            const response = await posService.getCategories(companyId, { page, limit: 10 });
            if (response.status === 'success' || response.status === 'Success') {
                setCategories(response.data.result.items);
                setPagination(response.data.result.pagination);
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

    const handleAdd = () => {
        setSelectedCategory(null);
        setIsModalOpen(true);
    };

    const handleEdit = (category: PosCategory) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
    };

    const handleDelete = async (category: PosCategory) => {
        if (window.confirm(`Are you sure you want to delete ${category.name}?`)) {
            try {
                await posService.deleteCategory(companyId, category.id);
                showToast('Category deleted successfully', 'success');
                fetchCategories();
            } catch (error) {
                console.error('Failed to delete category:', error);
                showToast('Failed to delete category', 'error');
            }
        }
    };

    const handleSubmit = async (data: Partial<PosCategory>) => {
        try {
            if (selectedCategory) {
                await posService.updateCategory(companyId, selectedCategory.id, data);
                showToast('Category updated successfully', 'success');
            } else {
                await posService.createCategory(companyId, data);
                showToast('Category created successfully', 'success');
            }
            fetchCategories();
        } catch (error) {
            console.error('Submit error:', error);
            showToast('Failed to save category', 'error');
            throw error;
        }
    };

    const columns: Column<PosCategory>[] = [
        { header: 'Category Name', accessorKey: 'name', sortable: true },
        { header: 'Description', accessorKey: 'description' },
        {
            header: 'Actions',
            align: 'right',
            cell: (item) => (
                <div className="flex justify-end gap-2">
                    <button 
                        onClick={() => handleEdit(item)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => handleDelete(item)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    >
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
                <button 
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20"
                >
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

            <CategoryModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                category={selectedCategory}
            />
        </div>
    );
};
