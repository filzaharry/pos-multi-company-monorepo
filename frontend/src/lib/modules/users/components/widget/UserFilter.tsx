import React from 'react';
import { Shield, Building2, Calendar } from 'lucide-react';
import { LookupOption } from '@/lib/modules/users/types';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';

interface UserFilterProps {
    roleId: string;
    setRoleId: (value: string) => void;
    roles: LookupOption[];
    companyId: string;
    setCompanyId: (value: string) => void;
    companies: LookupOption[];
    isSuperAdmin: boolean;
    startDate: string;
    setStartDate: (value: string) => void;
    endDate: string;
    setEndDate: (value: string) => void;
}

export const UserFilter: React.FC<UserFilterProps> = ({
    roleId,
    setRoleId,
    roles,
    companyId,
    setCompanyId,
    companies,
    isSuperAdmin,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
}) => {
    return (
        <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-primary ">Role</label>
                    <div className="relative">
                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <select
                            value={roleId}
                            onChange={(e) => setRoleId(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
                        >
                            <option value="" className="bg-background-dark text-gray-400">All Roles</option>
                            {roles.map(role => (
                                <option key={role.value} value={role.value.toString()} className="bg-background-dark text-white">{role.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {isSuperAdmin && (
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-primary ">Company</label>
                        <div className="relative">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <select
                                value={companyId}
                                onChange={(e) => setCompanyId(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
                            >
                                <option value="" className="bg-background-dark text-gray-400">All Companies</option>
                                {companies.map(company => (
                                    <option key={company.value} value={company.value.toString()} className="bg-background-dark text-white">{company.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-primary ">Joined After</label>
                    <div className="relative">
                        <CustomDatePicker
                            value={startDate}
                            onChange={(val) => setStartDate(val)}
                            placeholder="Select Start Date"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-primary ">Joined Before</label>
                    <div className="relative">
                        <CustomDatePicker
                            value={endDate}
                            onChange={(val) => setEndDate(val)}
                            placeholder="Select End Date"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
