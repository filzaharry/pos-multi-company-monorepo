import React, { useState, useEffect, useCallback } from 'react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { PosDelivery } from '../../types';
import { posService } from '../../services/pos.service';
import { PaginationData } from '@/lib/modules/users/types';

interface DeliveriesTabProps {
    companyId: number;
}

export const DeliveriesTab: React.FC<DeliveriesTabProps> = ({ companyId }) => {
    const [deliveries, setDeliveries] = useState<PosDelivery[]>([]);
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);

    const fetchDeliveries = useCallback(async () => {
        if (!companyId) return;
        setIsLoading(true);
        try {
            const response = await posService.getDeliveries(companyId, { page, limit: 10 });
            if (response.status === 'success' || response.status === 'Success') {
                setDeliveries(response.data.deliveries);
                setPagination(response.data.pagination);
            }
        } catch (error) {
            console.error('Failed to fetch deliveries:', error);
        } finally {
            setIsLoading(false);
        }
    }, [companyId, page]);

    useEffect(() => {
        fetchDeliveries();
    }, [fetchDeliveries]);

    const columns: Column<PosDelivery>[] = [
        { header: 'Order ID', accessorKey: 'order_id' },
        { header: 'Courier', accessorKey: 'courier_name' },
        { header: 'Tracking #', accessorKey: 'tracking_number' },
        { 
            header: 'Status', 
            accessorKey: 'status',
            cell: (del) => (
                <span className={ `px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    del.status === 'delivered' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                    del.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 
                    'bg-white/5 text-gray-500 border border-white/10'
                }` }>
                    {del.status}
                </span>
            )
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold text-white uppercase italic tracking-wider">Deliveries</h3>
                <p className="text-xs text-gray-500">Track shipments and courier performance.</p>
            </div>

            <DataTable
                columns={columns}
                data={deliveries}
                isLoading={isLoading}
                pagination={pagination}
                page={page}
                onPageChange={setPage}
            />
        </div>
    );
};
