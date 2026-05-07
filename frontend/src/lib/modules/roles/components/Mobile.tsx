'use client';

import React from 'react';
import { Role, PaginationData, LookupOption } from '@/lib/modules/users/types';
import { RoleHeader } from './widgets/RoleHeader';
import { RoleFilters } from './widgets/RoleFilters';
import { RoleCard } from './widgets/RoleCard';
import { RoleSkeleton } from './widgets/RoleSkeleton';
import { RolePagination } from './widgets/RolePagination';

interface MobileProps {
    roles: Role[];
    isLoading: boolean;
    pagination: PaginationData | null;
    search: string;
    setSearch: (val: string) => void;
    page: number;
    setPage: (val: number | ((p: number) => number)) => void;
    onAdd: () => void;
    onEdit: (role: Role) => void;
    onDelete: (role: Role) => void;
    onPermissions: (role: Role) => void;
    onDetail: (role: Role) => void;
    onOpenFilter: () => void;
    onApplyFilters: () => void;
    onResetFilters: () => void;
    appliedFiltersCount: number;
    companyId: string;
    setCompanyId: (val: string) => void;
    companies: LookupOption[];
    status: string;
    setStatus: (val: string) => void;
    isSuperAdmin: boolean;
}

export const Mobile: React.FC<MobileProps> = ({
    roles,
    isLoading,
    pagination,
    search,
    setSearch,
    page,
    setPage,
    onAdd,
    onEdit,
    onDelete,
    onPermissions,
    onDetail,
    onOpenFilter,
    onApplyFilters,
    onResetFilters,
    appliedFiltersCount,
    companyId,
    setCompanyId,
    companies,
    status,
    setStatus,
    isSuperAdmin
}) => {
    return (
        <div className="space-y-4">
            <RoleHeader
                title="Roles"
                onAdd={onAdd}
                isMobile
            />

            <RoleFilters
                search={search}
                setSearch={setSearch}
                setPage={setPage}
                onOpenFilter={onOpenFilter}
                appliedFiltersCount={appliedFiltersCount}
                onApplyFilters={onApplyFilters}
                onResetFilters={onResetFilters}
                companyId={companyId}
                setCompanyId={setCompanyId}
                companies={companies}
                status={status}
                setStatus={setStatus}
                isSuperAdmin={isSuperAdmin}
                isMobile
            />

            <div className="space-y-3">
                {isLoading ? (
                    <RoleSkeleton count={3} isMobile />
                ) : roles.length > 0 ? (
                    roles.map((role) => (
                        <RoleCard
                            key={role.id}
                            role={role}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onPermissions={onPermissions}
                            onDetail={onDetail}
                            isMobile
                        />
                    ))
                ) : (
                    <div className="py-12 text-center text-gray-500 text-sm">No roles found.</div>
                )}
            </div>

            <RolePagination
                pagination={pagination}
                page={page}
                setPage={setPage}
                isMobile
            />
        </div>
    );
};

