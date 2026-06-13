import React from 'react';
import { CompanySubscription } from '../../types';
import { FileText, Package as PackageIcon, CreditCard, Eye, Download, Plus } from 'lucide-react';
import moment from 'moment';
import { cn } from '@/lib/utils';
import { getPaymentStatusInfo } from '@/lib/utils/subscription';
import { handleDownloadInvoice } from '@/lib/utils/invoice';
import { SectionTitle } from './SectionTitle';

interface SubscriptionHistoryTableProps {
    history: CompanySubscription[];
    isLoading: boolean;
    onManageSubscription?: (sub: CompanySubscription) => void;
    onOpenCreatePayment: () => void;
}

export const SubscriptionHistoryTable: React.FC<SubscriptionHistoryTableProps> = ({
    history,
    isLoading,
    onManageSubscription,
    onOpenCreatePayment
}) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <SectionTitle icon={FileText} title="Payment History" />
                <button
                    onClick={onOpenCreatePayment}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                    <Plus className="w-4 h-4" />
                    Create New Payment
                </button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-12 text-slate-400">
                    <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
                </div>
            ) : history.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-2xl">
                    No transaction history found.
                </div>
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 ">#</th>
                                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 ">Package</th>
                                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 ">Period</th>
                                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 ">Method</th>
                                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 ">Amount</th>
                                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 ">Status</th>
                                <th className="text-right px-4 py-3 text-[10px] font-bold text-slate-500 ">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((sub, idx) => {
                                const paymentStatus = getPaymentStatusInfo(sub.payment_status);
                                const PaymentIcon = paymentStatus.icon;
                                return (
                                    <tr key={sub.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-3 text-slate-400 font-mono text-xs">{idx + 1}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <PackageIcon className="w-3.5 h-3.5 text-primary" />
                                                <span className="font-bold text-slate-800">{sub.package?.name || '-'}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-slate-500 text-xs">
                                            {sub.start_date ? moment(sub.start_date).format('DD MMM YY') : '-'}
                                            {' → '}
                                            {sub.end_date ? moment(sub.end_date).format('DD MMM YY') : '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                                <CreditCard className="w-3 h-3" />
                                                {sub.payment_method === 0 ? 'Bank' : 'QRIS'}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-bold text-slate-800 text-xs">
                                            Rp {sub.package?.pricing?.toLocaleString('id-ID') || '0'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={cn(
                                                "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border",
                                                paymentStatus.bg, paymentStatus.color, paymentStatus.border
                                            )}>
                                                <PaymentIcon className="w-3 h-3" />
                                                {paymentStatus.label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    onClick={() => onManageSubscription && onManageSubscription(sub)}
                                                    title="View & Edit Detail"
                                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 rounded-lg transition-all"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    Detail
                                                </button>
                                                {sub.payment_status === 1 && (
                                                    <button
                                                        onClick={() => handleDownloadInvoice(sub)}
                                                        title="Download Invoice"
                                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-all"
                                                    >
                                                        <Download className="w-3.5 h-3.5" />
                                                        Invoice
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
