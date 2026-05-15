import { Clock, CheckCircle2, Truck, Ban, RotateCcw } from 'lucide-react';

export const ORDER_STATUS = {
    PENDING: 0,
    PAID_CASHIER: 1,
    KITCHEN: 2,
    COMPLETED: 3,
    CANCELLED: 4,
    REFUND: 5,
};

export const ORDER_STATUS_LIST = [
    { value: ORDER_STATUS.PENDING, label: 'Order Masuk', icon: Clock, color: 'text-blue-500', badgeClass: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    { value: ORDER_STATUS.PAID_CASHIER, label: 'Terbayar', icon: CheckCircle2, color: 'text-emerald-500', badgeClass: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
    { value: ORDER_STATUS.KITCHEN, label: 'Proses Dapur', icon: Truck, color: 'text-amber-500', badgeClass: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
    { value: ORDER_STATUS.COMPLETED, label: 'Selesai', icon: CheckCircle2, color: 'text-primary', badgeClass: 'bg-primary/10 text-primary border-primary/20' },
    { value: ORDER_STATUS.CANCELLED, label: 'Dibatalkan', icon: Ban, color: 'text-red-500', badgeClass: 'bg-red-500/10 text-red-500 border-red-500/20' },
    { value: ORDER_STATUS.REFUND, label: 'Refund', icon: RotateCcw, color: 'text-purple-500', badgeClass: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
];

export const getOrderStatusLabel = (status: number) => {
    return ORDER_STATUS_LIST.find(s => s.value === status)?.label || 'Unknown';
};

export const getOrderStatusBadgeClass = (status: number) => {
    return ORDER_STATUS_LIST.find(s => s.value === status)?.badgeClass || 'bg-gray-500/10 text-gray-500 border-gray-500/20';
};
