import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { PaginationData, LookupOption } from '@/lib/modules/users/types';
import { ItemModal } from './components/ItemModal';
import { useToast } from '@/components/ui/Toast';
import { lookupService } from '@/lib/modules/users/services/lookup.service';
import { getCookie } from '@/lib/utils';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';
import { useCallback, useEffect, useState } from 'react';
import { PosItem } from '../../../types';
import { posService } from '../../../services/pos.service';
import { Column, DataTable } from '@/components/ui/DataTable';

interface ItemsTabProps {
    companyId: number;
}

export const ItemsTab: React.FC<ItemsTabProps> = ({ companyId }) => {
    const { showToast } = useToast();
    const [items, setItems] = useState<PosItem[]>([]);
    const [categories, setCategories] = useState<LookupOption[]>([]);
    const [levels, setLevels] = useState<LookupOption[]>([]);
    const [extras, setExtras] = useState<LookupOption[]>([]);
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<PosItem | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<PosItem | null>(null);

    const fetchItems = useCallback(async () => {
        if (!companyId) return;
        setIsLoading(true);
        try {
            const response = await posService.getItems(companyId, { page, limit: 10 });
            if (response.status === 'success' || response.status === 'Success') {
                setItems(response.data.result.items);
                setPagination(response.data.result.pagination);
            }
        } catch (error) {
            console.error('Failed to fetch items:', error);
            showToast('Failed to load items', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [companyId, page, showToast]);

    const fetchCategories = useCallback(async () => {
        if (!companyId) return;
        const token = getCookie('accessToken');
        if (!token) return;
        try {
            const response = await lookupService.getPosCategoryOptions(token, companyId);
            if (response.status === 'success' || response.status === 'Success') {
                setCategories(response.data.result);
            }
        } catch (error) {
            console.error('Failed to fetch categories lookup:', error);
        }
    }, [companyId]);

    const fetchLevels = useCallback(async () => {
        if (!companyId) return;
        try {
            const response = await posService.getLevels(companyId, { page: 1, limit: 100 });
            if (response.status === 'success' || response.status === 'Success') {
                const options = response.data.result.items.map(lvl => ({
                    label: lvl.name,
                    value: lvl.id.toString()
                }));
                setLevels(options);
            }
        } catch (error) {
            console.error('Failed to fetch levels:', error);
        }
    }, [companyId]);

    const fetchExtras = useCallback(async () => {
        if (!companyId) return;
        try {
            const response = await posService.getExtras(companyId, { page: 1, limit: 100 });
            if (response.status === 'success' || response.status === 'Success') {
                const options = response.data.result.items.map(ext => ({
                    label: ext.name,
                    value: ext.id.toString()
                }));
                setExtras(options);
            }
        } catch (error) {
            console.error('Failed to fetch extras:', error);
        }
    }, [companyId]);

    useEffect(() => {
        fetchItems();
        fetchCategories();
        fetchLevels();
        fetchExtras();
    }, [fetchItems, fetchCategories, fetchLevels, fetchExtras]);

    const handleAdd = () => {
        setSelectedItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: PosItem) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = (item: PosItem) => {
        setItemToDelete(item);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete || !companyId) return;
        try {
            await posService.deleteItem(companyId, itemToDelete.id);
            showToast('Item deleted successfully', 'success');
            fetchItems();
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
        } catch (error) {
            console.error('Failed to delete item:', error);
            showToast('Failed to delete item', 'error');
        }
    };

    const handleSubmit = async (data: FormData) => {
        try {
            if (selectedItem) {
                await posService.updateItem(companyId, selectedItem.id, data);
                showToast('Item updated successfully', 'success');
            } else {
                await posService.createItem(companyId, data);
                showToast('Item created successfully', 'success');
            }
            fetchItems();
        } catch (error) {
            console.error('Submit error:', error);
            showToast('Failed to save item', 'error');
            throw error; // Rethrow to let modal keep loading state if needed
        }
    };

    const columns: Column<PosItem>[] = [
        { header: 'Item Name', accessorKey: 'name', sortable: true },
        { header: 'SKU', accessorKey: 'sku', sortable: true },
        {
            header: 'Category',
            accessorKey: 'category.name',
            cell: (item) => item.category?.name || '-'
        },
        {
            header: 'Price',
            accessorKey: 'price',
            cell: (item) => `Rp ${item.price.toLocaleString()}`
        },
        { header: 'Stock', accessorKey: 'stock_quantity' },
        {
            header: 'Actions',
            align: 'right',
            cell: (item) => (
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-slate-800 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(item)}
                        className="p-2 text-slate-800 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
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
                    <h3 className="text-xl font-bold text-slate-800 uppercase italic tracking-wider">Product Items</h3>
                    <p className="text-xs text-slate-800">Manage your company inventory and pricing.</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add New Item</span>
                </button>
            </div>

            <DataTable
                columns={columns}
                data={items}
                isLoading={isLoading}
                pagination={pagination}
                page={page}
                onPageChange={setPage}
            />

            <ItemModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                item={selectedItem}
                categories={categories}
                levels={levels}
                extras={extras}
                companyId={companyId}
            />
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Item?"
                description={`Are you sure you want to delete ${itemToDelete?.name}?`}
            />
        </div>
    );
};
