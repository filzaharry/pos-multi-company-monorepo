import { Column, DataTable } from '@/components/ui/DataTable';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';
import { useToast } from '@/components/ui/Toast';
import { PaginationData } from '@/lib/modules/users/types';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { posService } from '../../../services/pos.service';
import { PosExtra } from '../../../types';
import { ExtraModal } from './components/ExtraModal';

interface ExtrasTabProps {
    companyId: number;
}

export const ExtrasTab: React.FC<ExtrasTabProps> = ({ companyId }) => {
    const { showToast } = useToast();
    const [extras, setExtras] = useState<PosExtra[]>([]);
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedExtra, setSelectedExtra] = useState<PosExtra | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [extraToDelete, setExtraToDelete] = useState<PosExtra | null>(null);

    const fetchExtras = useCallback(async () => {
        if (!companyId) return;
        setIsLoading(true);
        try {
            const response = await posService.getExtras(companyId, { page, limit: 10 });
            if (response.status === 'success' || response.status === 'Success') {
                setExtras(response.data.result.items);
                setPagination(response.data.result.pagination);
            }
        } catch (error) {
            console.error('Failed to fetch extras:', error);
        } finally {
            setIsLoading(false);
        }
    }, [companyId, page]);

    useEffect(() => {
        fetchExtras();
    }, [fetchExtras]);

    const handleAdd = () => {
        setSelectedExtra(null);
        setIsModalOpen(true);
    };

    const handleEdit = (extra: PosExtra) => {
        setSelectedExtra(extra);
        setIsModalOpen(true);
    };

    const handleDelete = (extra: PosExtra) => {
        setExtraToDelete(extra);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!extraToDelete || !companyId) return;
        try {
            await posService.deleteExtra(companyId, extraToDelete.id);
            showToast('Extra deleted successfully', 'success');
            fetchExtras();
            setIsDeleteModalOpen(false);
            setExtraToDelete(null);
        } catch (error) {
            console.error('Failed to delete extra:', error);
            showToast('Failed to delete extra', 'error');
        }
    };

    const handleSubmit = async (data: Partial<PosExtra>) => {
        try {
            if (selectedExtra) {
                await posService.updateExtra(companyId, selectedExtra.id, data);
                showToast('Extra updated successfully', 'success');
            } else {
                await posService.createExtra(companyId, data);
                showToast('Extra created successfully', 'success');
            }
            fetchExtras();
        } catch (error) {
            console.error('Submit error:', error);
            showToast('Failed to save extra', 'error');
            throw error;
        }
    };

    const columns: Column<PosExtra>[] = [
        { header: 'Extra Name', accessorKey: 'name', sortable: true },
        {
            header: 'Price',
            accessorKey: 'price',
            cell: (item) => (
                <span className="text-slate-800 font-bold">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(item.price))}
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
                    <h3 className="text-xl font-bold text-slate-800   italic    ">Extras / Add-ons</h3>
                    <p className="text-xs text-slate-800">Manage extra toppings, sauces, or add-ons.</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add New Extra</span>
                </button>
            </div>

            <DataTable
                columns={columns}
                data={extras}
                isLoading={isLoading}
                pagination={pagination}
                page={page}
                onPageChange={setPage}
            />

            <ExtraModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                extra={selectedExtra}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Extra?"
                description={`Are you sure you want to delete ${extraToDelete?.name}?`}
            />
        </div>
    );
};
