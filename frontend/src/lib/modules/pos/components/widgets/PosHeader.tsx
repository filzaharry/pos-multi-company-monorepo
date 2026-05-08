import React from 'react';
import { ShoppingCart, Building2, ChevronDown } from 'lucide-react';
import { LookupOption } from '@/lib/modules/users/types';
import { User } from '@/lib/modules/login/types';

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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1">
                <div className="flex items-center gap-3">
                    <div>
                        <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Point of Sale</h1>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">Management Console</p>
                    </div>
                </div>
            </div>

            {/* Company Selector */}
            <div className="w-full md:w-80">
                <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 block px-1">Selected Company</label>
                <div className="relative group">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                    <select
                        value={activeCompanyId || ''}
                        onChange={(e) => setActiveCompanyId(e.target.value ? Number(e.target.value) : null)}
                        disabled={!isSuperAdmin}
                        className="w-full pl-11 pr-10 py-3 bg-background-dark/50 border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all appearance-none disabled:opacity-60 disabled:cursor-not-allowed shadow-xl"
                    >
                        {!activeCompanyId && <option value="">Select a company to manage</option>}
                        {isSuperAdmin ? (
                            companies.map(c => (
                                <option key={c.value} value={c.value}>{c.label}</option>
                            ))
                        ) : (
                            currentUser?.company && (
                                <option value={currentUser.company_id}>{currentUser.company.name}</option>
                            )
                        )}
                    </select>
                    {isSuperAdmin && <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />}
                </div>
            </div>
        </div>
    );
};
