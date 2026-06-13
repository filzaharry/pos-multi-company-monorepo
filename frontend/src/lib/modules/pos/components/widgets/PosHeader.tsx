import React from 'react';
import { Building2, ChevronDown } from 'lucide-react';
import { LookupOption } from '@/lib/modules/users/types';
import { User } from '@/lib/modules/login/types';
import { PageHeader } from '@/components/ui/PageHeader';

interface PosHeaderProps {
    isSuperAdmin: boolean;
    activeCompanyId: number | null;
    setActiveCompanyId: (id: number | null) => void;
    companies: LookupOption[];
    currentUser: User | null;
}

export const PosHeader: React.FC<PosHeaderProps> = ({
    isSuperAdmin,
    activeCompanyId,
    setActiveCompanyId,
    companies,
    currentUser
}) => {
    return (
        <PageHeader
            title="Point of Sale"
            subtitle="Manage your point of sale items, categories, and orders."
            actions={
                <div className="w-full md:w-80">
                    <label className="text-[10px] font-bold text-slate-500   tracking-[0.2em] mb-1.5 block px-0.5">Selected Company</label>
                    <div className="relative group">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                        <select
                            value={activeCompanyId || ''}
                            onChange={(e) => setActiveCompanyId(e.target.value ? Number(e.target.value) : null)}
                            disabled={!isSuperAdmin}
                            className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none disabled:opacity-60 disabled:cursor-not-allowed shadow-xs"
                        >
                            {!activeCompanyId && <option value="" className="text-slate-800">Select a company to manage</option>}
                            {isSuperAdmin ? (
                                companies.map(c => (
                                    <option key={c.value} value={c.value} className="text-slate-800">{c.label}</option>
                                ))
                            ) : (
                                currentUser?.company && (
                                    <option value={currentUser.company_id} className="text-slate-800">{currentUser.company.name}</option>
                                )
                            )}
                        </select>
                        {isSuperAdmin && <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />}
                    </div>
                </div>
            }
        />
    );
};
