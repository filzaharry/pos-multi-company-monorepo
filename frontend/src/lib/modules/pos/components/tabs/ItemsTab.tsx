import React, { useState, useEffect, useCallback } from 'react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { PosItem } from '../../types';
import { posService } from '../../services/pos.service';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { PaginationData } from '@/lib/modules/users/types';

interface ItemsTabProps {
    companyId: number;
}

export const ItemsTab: React.FC<ItemsTabProps> = ({ companyId }) => {
    const [items, setItems] = useState<PosItem[]>([]);
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);

    const fetchItems = useCallback(async () => {
        if (!companyId) return;
        setIsLoading(true);
        try {
            const response = await posService.getItems(companyId, { page, limit: 10 });
            if (response.status === 'success' || response.status === 'Success') {
                setItems(response.data.items);
                setPagination(response.data.pagination);
            }
        } catch (error) {
            console.error('Failed to fetch items:', error);
        } finally {
            setIsLoading(false);
        }
    }, [companyId, page]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

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
        { header: 'Stock', accessorKey: 'stock' },
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
                    <h3 className="text-xl font-bold text-white uppercase italic tracking-wider">Product Items</h3>
                    <p className="text-xs text-gray-500">Manage your company inventory and pricing.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20">
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
        </div>
    );
};
