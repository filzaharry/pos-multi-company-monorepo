import React, { useState, useEffect, useCallback } from 'react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { PosOrder } from '../../../types';
import { posService } from '../../../services/pos.service';
import { PaginationData } from '@/lib/modules/users/types';
import moment from 'moment';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { OrderModal } from './components/OrderModal';
import { UpdateOrderModal } from './components/UpdateOrderModal';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';
import { useToast } from '@/components/ui/Toast';
import { getOrderStatusLabel, getOrderStatusBadgeClass } from '../../../constants';

interface OrdersTabProps {
    companyId: number;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({ companyId }) => {
    const { showToast } = useToast();
    const [orders, setOrders] = useState<PosOrder[]>([]);
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<PosOrder | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState<PosOrder | null>(null);

    const fetchOrders = useCallback(async () => {
        if (!companyId) return;
        setIsLoading(true);
        try {
            const response = await posService.getOrders(companyId, { page, limit: 10 });
            if (response.status === 'success' || response.status === 'Success') {
                setOrders(response.data.result.items);
                setPagination(response.data.result.pagination);
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

    const handleSubmit = async (data: Partial<PosOrder>) => {
        try {
            await posService.createOrder(companyId, data);
            showToast('Order created successfully', 'success');
            fetchOrders();
        } catch (error) {
            console.error('Failed to create order', error);
            showToast('Failed to create order', 'error');
            throw error;
        }
    };

    const handleUpdate = async (data: { status: number, payment_status: string, notes?: string }) => {
        if (!selectedOrder) return;
        try {
            await posService.updateOrder(companyId, selectedOrder.id, data);
            showToast('Order updated successfully', 'success');
            fetchOrders();
        } catch (error) {
            console.error('Failed to update order', error);
            showToast('Failed to update order', 'error');
        }
    };

    const confirmDelete = async () => {
        if (!orderToDelete) return;
        try {
            await posService.deleteOrder(companyId, orderToDelete.id);
            showToast('Order deleted successfully', 'success');
            fetchOrders();
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Failed to delete order', error);
            showToast('Failed to delete order', 'error');
        }
    };

    const columns: Column<PosOrder>[] = [
        { header: 'Order Code', accessorKey: 'code' },
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
            header: 'Payment', 
            accessorKey: 'payment_status',
            cell: (ord) => (
                <span className={ `px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    ord.payment_status === 'Paid' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                    ord.payment_status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 
                    'bg-red-500/10 text-red-500 border-red-500/20'
                }` }>
                    {ord.payment_status}
                </span>
            )
        },
        { 
            header: 'Status', 
            accessorKey: 'status',
            cell: (ord) => (
                <span className={ `px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getOrderStatusBadgeClass(ord.status)}` }>
                    {getOrderStatusLabel(ord.status)}
                </span>
            )
        },
        {
            header: 'Actions',
            align: 'right',
            cell: (ord) => (
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => {
                            setSelectedOrder(ord);
                            setIsUpdateModalOpen(true);
                        }}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => {
                            setOrderToDelete(ord);
                            setIsDeleteModalOpen(true);
                        }}
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
                    <h3 className="text-xl font-bold text-white uppercase italic tracking-wider">Transaction Orders</h3>
                    <p className="text-xs text-gray-500">Monitor your sales and payment statuses.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20"
                >
                    <Plus className="w-4 h-4" />
                    <span>Create New Order</span>
                </button>
            </div>

            <DataTable
                columns={columns}
                data={orders}
                isLoading={isLoading}
                pagination={pagination}
                page={page}
                onPageChange={setPage}
            />

            <OrderModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                companyId={companyId}
            />

            <UpdateOrderModal
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                onSubmit={handleUpdate}
                order={selectedOrder}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Order?"
                description={`Are you sure you want to delete order #${orderToDelete?.id}? This action cannot be undone.`}
            />
        </div>
    );
};
