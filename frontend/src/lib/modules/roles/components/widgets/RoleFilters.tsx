import React, { useState } from 'react';
import { Search, X, Filter, ChevronDown, Building2, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LookupOption } from '@/lib/modules/users/types';

interface RoleFiltersProps {
    search: string;
    setSearch: (val: string) => void;
    setPage: (val: number | ((p: number) => number)) => void;
    onOpenFilter?: () => void;
    appliedFiltersCount?: number;
    onApplyFilters?: () => void;
    onResetFilters?: () => void;
    companyId?: string;
    setCompanyId?: (val: string) => void;
    companies?: LookupOption[];
    status?: string;
    setStatus?: (val: string) => void;
    isSuperAdmin?: boolean;
    isMobile?: boolean;
}

export const RoleFilters: React.FC<RoleFiltersProps> = ({
    search,
    setSearch,
    setPage,
    onOpenFilter,
    appliedFiltersCount = 0,
    onApplyFilters,
    onResetFilters,
    companyId,
    setCompanyId,
    companies = [],
    status,
    setStatus,
    isSuperAdmin = false,
    isMobile
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (isMobile) {
        return (
            <div className="space-y-3">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search roles..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none"
                        />
                        {search && (
                            <button
                                onClick={() => { setSearch(''); setPage(1); }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={cn(
                            "p-2 rounded-xl border transition-all relative",
                            appliedFiltersCount > 0 ? "bg-primary/10 border-primary text-primary" : "bg-white/5 border-white/10 text-gray-400"
                        )}
                    >
                        <Filter className="w-5 h-5" />
                        {appliedFiltersCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-background-dark">
                                {appliedFiltersCount}
                            </span>
                        )}
                    </button>
                </div>

                {isExpanded && (
                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-4 animate-in slide-in-from-top-2 duration-200">
                        {isSuperAdmin && setCompanyId && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-500  px-1">Company</label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                                    <select
                                        value={companyId}
                                        onChange={(e) => setCompanyId(e.target.value)}
                                        className="w-full pl-9 pr-8 py-2 bg-background-dark border border-white/10 rounded-xl text-xs text-white appearance-none focus:outline-none focus:ring-1 focus:ring-primary/50"
                                    >
                                        <option value="">All Companies</option>
                                        {companies.map(c => (
                                            <option key={c.value} value={c.value}>{c.label}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
                                </div>
                            </div>
                        )}

                        {setStatus && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-500  px-1">Status</label>
                                <div className="relative">
                                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full pl-9 pr-8 py-2 bg-background-dark border border-white/10 rounded-xl text-xs text-white appearance-none focus:outline-none focus:ring-1 focus:ring-primary/50"
                                    >
                                        <option value="">All Status</option>
                                        <option value="1">Active</option>
                                        <option value="0">Inactive</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
                                </div>
                            </div>
                        )}

                        <div className="flex gap-2 pt-2">
                            <button
                                onClick={() => {
                                    onResetFilters?.();
                                    setIsExpanded(false);
                                }}
                                className="flex-1 py-2 text-xs font-bold text-gray-400 bg-white/5 rounded-xl hover:text-white transition-colors      "
                            >
                                Reset
                            </button>
                            <button
                                onClick={() => {
                                    onApplyFilters?.();
                                    setIsExpanded(false);
                                }}
                                className="flex-1 py-2 text-xs font-bold text-white bg-primary rounded-xl shadow-lg shadow-primary/20      "
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="p-6 bg-background-dark/50 border border-white/5 rounded-2xl backdrop-blur-sm">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search by role name or description..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-600"
                    />
                </div>
                {search && (
                    <button
                        onClick={() => { setSearch(''); setPage(1); }}
                        className="flex items-center justify-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium px-4"
                    >
                        <X className="w-4 h-4" />
                        <span>Reset</span>
                    </button>
                )}
            </div>
        </div>
    );
};
