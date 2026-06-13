import React, { useState, useEffect, useCallback } from 'react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { PosDelivery } from '../../../types';
import { posService } from '../../../services/pos.service';
import { PaginationData } from '@/lib/modules/users/types';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { DeliveryModal } from './components/DeliveryModal';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';

interface DeliveriesTabProps {
    companyId: number;
}

export const DeliveriesTab: React.FC<DeliveriesTabProps> = ({ companyId }) => {
    const { showToast } = useToast();
    const [deliveries, setDeliveries] = useState<PosDelivery[]>([]);
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDelivery, setSelectedDelivery] = useState<PosDelivery | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deliveryToDelete, setDeliveryToDelete] = useState<PosDelivery | null>(null);

    const fetchDeliveries = useCallback(async () => {
        if (!companyId) return;
        setIsLoading(true);
        try {
            const response = await posService.getDeliveries(companyId, { page, limit: 10 });
            if (response.status === 'success' || response.status === 'Success') {
                setDeliveries(response.data.result.items);
                setPagination(response.data.result.pagination);
            }
        } catch (error) {
            console.error('Failed to fetch deliveries:', error);
            showToast('Failed to load deliveries', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [companyId, page, showToast]);

    useEffect(() => {
        fetchDeliveries();
    }, [fetchDeliveries]);

    const handleAdd = () => {
        setSelectedDelivery(null);
        setIsModalOpen(true);
    };

    const handleEdit = (delivery: PosDelivery) => {
        setSelectedDelivery(delivery);
        setIsModalOpen(true);
    };

    const handleDelete = (delivery: PosDelivery) => {
        setDeliveryToDelete(delivery);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!deliveryToDelete || !companyId) return;
        try {
            await posService.deleteDelivery(companyId, deliveryToDelete.id);
            showToast('Delivery deleted successfully', 'success');
            fetchDeliveries();
            setIsDeleteModalOpen(false);
            setDeliveryToDelete(null);
        } catch (error) {
            console.error('Failed to delete delivery:', error);
            showToast('Failed to delete delivery', 'error');
        }
    };

    const handleSubmit = async (data: Partial<PosDelivery>) => {
        try {
            if (selectedDelivery) {
                await posService.updateDelivery(companyId, selectedDelivery.id, data);
                showToast('Delivery updated successfully', 'success');
            } else {
                await posService.createDelivery(companyId, data);
                showToast('Delivery created successfully', 'success');
            }
            fetchDeliveries();
        } catch (error) {
            console.error('Submit error:', error);
            showToast('Failed to save delivery', 'error');
            throw error;
        }
    };

    const columns: Column<PosDelivery>[] = [
        { header: 'Delivery Name', accessorKey: 'name' },
        { header: 'Description', accessorKey: 'description' },
        {
            header: 'Price',
            accessorKey: 'price',
            cell: (del) => (
                <span className="text-slate-800 font-bold">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(del.price))}
                </span>
            )
        },
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
                    <h3 className="text-xl font-bold text-slate-800   italic    ">Delivery Methods</h3>
                    <p className="text-xs text-slate-800">Manage delivery services and shipping rates.</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Delivery Method</span>
                </button>
            </div>

            <DataTable
                columns={columns}
                data={deliveries}
                isLoading={isLoading}
                pagination={pagination}
                page={page}
                onPageChange={setPage}
            />

            <DeliveryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                delivery={selectedDelivery}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Delivery Method?"
                description={`Are you sure you want to delete ${deliveryToDelete?.name}?`}
            />
        </div>
    );
};
