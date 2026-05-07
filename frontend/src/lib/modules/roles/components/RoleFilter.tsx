import React from 'react';
import { Building2, ShieldCheck } from 'lucide-react';
import { LookupOption } from '@/lib/modules/users/types';

interface RoleFilterProps {
    companyId: string;
    setCompanyId: (value: string) => void;
    companies: LookupOption[];
    status: string;
    setStatus: (value: string) => void;
    isSuperAdmin?: boolean;
}

export const RoleFilter: React.FC<RoleFilterProps> = ({
    companyId,
    setCompanyId,
    companies,
    status,
    setStatus,
    isSuperAdmin = false,
}) => {
    return (
        <div className="grid grid-cols-1 gap-6">
            {isSuperAdmin && (
                <div className="space-y-2">
                    <label className="text-xs font-black text-primary uppercase tracking-widest">Company</label>
                    <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <select
                            value={companyId}
                            onChange={(e) => setCompanyId(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
                        >
                            <option value="" className="bg-background-dark">All Companies</option>
                            {companies.map((company) => (
                                <option key={company.value} value={company.value} className="bg-background-dark">
                                    {company.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            <div className="space-y-2">
                <label className="text-xs font-black text-primary uppercase tracking-widest">Status</label>
                <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
                    >
                        <option value="" className="bg-background-dark">All Status</option>
                        <option value="1" className="bg-background-dark">Active</option>
                        <option value="0" className="bg-background-dark">Inactive</option>
                    </select>
                </div>
            </div>
        </div>
    );
};
