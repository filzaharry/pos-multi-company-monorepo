import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { CompanyHeader } from '../modules/subscriptions/types';

export const getPaymentStatusInfo = (status: number) => {
    if (status === 1) return { label: 'Paid', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle };
    if (status === 2) return { label: 'Failed', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', icon: AlertCircle };
    return { label: 'Pending', color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', icon: Clock };
};

export const getCompanyStatusInfo = (company: CompanyHeader) => {
    if (company.status === 0) return { label: 'Pending Registration', color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200' };
    if (company.status === 2) return { label: 'Suspended', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' };
    if (company.subscription_end_date) {
        const endDate = new Date(company.subscription_end_date);
        const now = new Date();
        if (endDate < now) return { label: 'Expired', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' };
    }
    return { label: 'Active', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' };
};
