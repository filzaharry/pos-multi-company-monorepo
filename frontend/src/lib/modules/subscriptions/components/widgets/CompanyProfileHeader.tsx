import React from 'react';
import { CompanyHeader, CompanySubscription } from '../../types';
import { getImageUrl, cn } from '@/lib/utils';
import { getCompanyStatusInfo } from '@/lib/utils/subscription';
import moment from 'moment';
import { Building2, Calendar, CheckCircle } from 'lucide-react';

interface CompanyProfileHeaderProps {
    company: CompanyHeader;
    history: CompanySubscription[];
    onOpenEditModal: () => void;
}

export const CompanyProfileHeader: React.FC<CompanyProfileHeaderProps> = ({ company, history, onOpenEditModal }) => {
    const statusInfo = getCompanyStatusInfo(company);

    // Calculate total LTV
    const totalLTV = history
        .filter(s => s.payment_status === 1)
        .reduce((sum, s) => sum + (s.package?.pricing || 0), 0);

    // Calculate total subscription duration
    const totalDays = history
        .filter(s => s.payment_status === 1 && s.start_date && s.end_date)
        .reduce((sum, s) => {
            const start = new Date(s.start_date!);
            const end = new Date(s.end_date!);
            return sum + Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        }, 0);

    const totalMonths = Math.floor(totalDays / 30);
    const remainingDays = totalDays % 30;

    return (
        <>
            {/* ── Banner & Profile Picture ── */}
            <div className="relative">
                {/* Banner */}
                <div className="h-48 md:h-64 w-full bg-slate-200 relative overflow-hidden">
                    {company.banner_url ? (
                        <img src={getImageUrl(company.banner_url)!} alt="Banner" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-slate-200 to-slate-300 flex items-center justify-center text-slate-400">
                            <span className="text-sm font-bold ">No Banner</span>
                        </div>
                    )}
                </div>

                {/* Profile Picture / Logo */}
                <div className="absolute -bottom-12 left-8">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white border-4 border-background-light shadow-xl overflow-hidden relative">
                        {company.logo_url ? (
                            <img src={getImageUrl(company.logo_url)!} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                <Building2 className="w-8 h-8 text-slate-300" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="px-8 mt-16 pb-8 space-y-12">
                {/* ── LinkedIn-style Info Section ── */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b border-slate-200 pb-8 mt-4">
                    {/* Left Side (Name, Subtitle, Contact, Stats) */}
                    <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
                                    {company.name}
                                </h1>
                                <p className="text-base text-slate-700 mt-1">
                                    /{company.route} | {company.email || 'No email'} | {company.phone || 'No phone'}
                                </p>
                            </div>
                            <button
                                onClick={onOpenEditModal}
                                className="px-4 py-2 border border-slate-300 rounded-full text-slate-700 hover:bg-slate-50 font-bold text-sm transition-colors"
                            >
                                Edit profile
                            </button>
                        </div>

                        {/* Status Alert Box (Mimicking LinkedIn Verification Box) */}
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 relative">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h4 className="font-bold text-slate-900">
                                        Subscription Status: {statusInfo.label}
                                    </h4>
                                    <p className="text-sm text-slate-600 mt-1">
                                        {company.subscription_end_date
                                            ? `Account is active and verified until ${moment(company.subscription_end_date).format('DD MMMM YYYY')}.`
                                            : 'Account does not have an active subscription.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="text-sm text-slate-500 pt-2">
                            <span>
                                {totalMonths > 0 ? `${totalMonths} Months` : ''}
                                {remainingDays > 0 ? ` ${remainingDays} Days` : ''}
                                {totalDays === 0 && '0 Days'} Subscription
                            </span>
                            <span className="mx-2">•</span>
                            <span className="font-bold text-slate-700">{history.length} Transactions</span>

                            <div className="mt-2">
                                <span className="font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer">
                                    Total LTV: Rp {totalLTV.toLocaleString('id-ID')}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side (Mimicking LinkedIn Company/University tags) */}
                    <div className="w-full md:w-64 space-y-4 pt-2">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 flex-shrink-0 bg-slate-100 flex items-center justify-center rounded-sm">
                                <CheckCircle className={cn("w-5 h-5", statusInfo.color)} />
                            </div>
                            <span className="text-sm font-bold text-slate-900 leading-tight">
                                {statusInfo.label} Account
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 flex-shrink-0 bg-slate-100 flex items-center justify-center rounded-sm">
                                <Calendar className="w-5 h-5 text-slate-600" />
                            </div>
                            <span className="text-sm font-bold text-slate-900 leading-tight">
                                Active until<br />
                                <span className="font-normal text-slate-600">
                                    {company.subscription_end_date ? moment(company.subscription_end_date).format('DD MMM YYYY') : '-'}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
