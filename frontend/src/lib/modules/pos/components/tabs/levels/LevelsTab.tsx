import { Column, DataTable } from '@/components/ui/DataTable';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';
import { useToast } from '@/components/ui/Toast';
import { PaginationData } from '@/lib/modules/users/types';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { posService } from '../../../services/pos.service';
import { PosLevel } from '../../../types';
import { LevelModal } from './components/LevelModal';

interface LevelsTabProps {
    companyId: number;
}

export const LevelsTab: React.FC<LevelsTabProps> = ({ companyId }) => {
    const { showToast } = useToast();
    const [levels, setLevels] = useState<PosLevel[]>([]);
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState<PosLevel | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [levelToDelete, setLevelToDelete] = useState<PosLevel | null>(null);

    const fetchLevels = useCallback(async () => {
        if (!companyId) return;
        setIsLoading(true);
        try {
            const response = await posService.getLevels(companyId, { page, limit: 10 });
            if (response.status === 'success' || response.status === 'Success') {
                setLevels(response.data.result.items);
                setPagination(response.data.result.pagination);
            }
        } catch (error) {
            console.error('Failed to fetch levels:', error);
        } finally {
            setIsLoading(false);
        }
    }, [companyId, page]);

    useEffect(() => {
        fetchLevels();
    }, [fetchLevels]);

    const handleAdd = () => {
        setSelectedLevel(null);
        setIsModalOpen(true);
    };

    const handleEdit = (level: PosLevel) => {
        setSelectedLevel(level);
        setIsModalOpen(true);
    };

    const handleDelete = (level: PosLevel) => {
        setLevelToDelete(level);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!levelToDelete || !companyId) return;
        try {
            await posService.deleteLevel(companyId, levelToDelete.id);
            showToast('Level deleted successfully', 'success');
            fetchLevels();
            setIsDeleteModalOpen(false);
            setLevelToDelete(null);
        } catch (error) {
            console.error('Failed to delete level:', error);
            showToast('Failed to delete level', 'error');
        }
    };

    const handleSubmit = async (data: Partial<PosLevel>) => {
        try {
            if (selectedLevel) {
                await posService.updateLevel(companyId, selectedLevel.id, data);
                showToast('Level updated successfully', 'success');
            } else {
                await posService.createLevel(companyId, data);
                showToast('Level created successfully', 'success');
            }
            fetchLevels();
        } catch (error) {
            console.error('Submit error:', error);
            showToast('Failed to save level', 'error');
            throw error;
        }
    };

    const columns: Column<PosLevel>[] = [
        { header: 'Level Name', accessorKey: 'name', sortable: true },
        { header: 'Description', accessorKey: 'description' },
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
                    <h3 className="text-xl font-bold text-slate-800 uppercase italic tracking-wider">Levels</h3>
                    <p className="text-xs text-slate-800">Manage spicy levels or product variations.</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add New Level</span>
                </button>
            </div>

            <DataTable
                columns={columns}
                data={levels}
                isLoading={isLoading}
                pagination={pagination}
                page={page}
                onPageChange={setPage}
            />

            <LevelModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                level={selectedLevel}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Level?"
                description={`Are you sure you want to delete ${levelToDelete?.name}?`}
            />
        </div>
    );
};
