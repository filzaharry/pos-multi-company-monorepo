import React, { useState, useEffect, useCallback } from 'react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { PosOrder } from '../../types';
import { posService } from '../../services/pos.service';
import { PaginationData } from '@/lib/modules/users/types';
import moment from 'moment';

interface OrdersTabProps {
    companyId: number;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({ companyId }) => {
    const [orders, setOrders] = useState<PosOrder[]>([]);
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);

    const fetchOrders = useCallback(async () => {
        if (!companyId) return;
        setIsLoading(true);
        try {
            const response = await posService.getOrders(companyId, { page, limit: 10 });
            if (response.status === 'success' || response.status === 'Success') {
                setOrders(response.data.orders);
                setPagination(response.data.pagination);
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setIsLoading(false);
        }
    }, [companyId, page]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const columns: Column<PosOrder>[] = [
        { header: 'Order ID', accessorKey: 'id' },
        { 
            header: 'Date', 
            accessorKey: 'created_at',
            cell: (ord) => moment(ord.created_at).format('DD MMM YYYY HH:mm')
        },
        { 
            header: 'Total', 
            accessorKey: 'total_amount',
            cell: (ord) => `Rp ${ord.total_amount.toLocaleString()}`
        },
        { 
            header: 'Status', 
            accessorKey: 'status',
            cell: (ord) => (
                <span className={ `px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    ord.status === 'paid' || ord.status === 'completed' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                    ord.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 
                    'bg-red-500/10 text-red-500 border border-red-500/20'
                }` }>
                    {ord.status}
                </span>
            )
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold text-white uppercase italic tracking-wider">Transaction Orders</h3>
                <p className="text-xs text-gray-500">Monitor your sales and payment statuses.</p>
            </div>

            <DataTable
                columns={columns}
                data={orders}
                isLoading={isLoading}
                pagination={pagination}
                page={page}
                onPageChange={setPage}
            />
        </div>
    );
};
