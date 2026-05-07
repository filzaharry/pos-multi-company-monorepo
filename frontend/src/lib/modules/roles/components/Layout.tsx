'use client';

import { FilterModal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/Toast';
import { userService } from '@/lib/modules/users/services/user.service';
import { PaginationData, Role, RolePayload, LookupOption } from '@/lib/modules/users/types';
import { useLogin } from '@/lib/modules/login/store/useLogin';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Desktop } from './Desktop';
import { Mobile } from './Mobile';
import { RoleDetailModal } from './RoleDetail';
import { RoleFilter } from './RoleFilter';
import { RoleModal } from './RoleModal';

export const Layout = () => {
    const { user: currentUser } = useLogin();
    const { showToast } = useToast();

    // State
    const [roles, setRoles] = useState<Role[]>([]);
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [companies, setCompanies] = useState<LookupOption[]>([]);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

    // Filters
    const [search, setSearch] = useState('');
    const [companyId, setCompanyId] = useState('');
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);
    const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');

    // Applied Filters
    const [appliedFilters, setAppliedFilters] = useState({
        companyId: '',
        status: ''
    });

    // Responsiveness
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const fetchInitialData = useCallback(async () => {
        try {
            const response = await userService.getCompanyOptions();
            if (response.status === 'success' || response.status === 'Success') {
                setCompanies(response.data.result);
            }
        } catch (error) {
            console.error('Failed to fetch initial data:', error);
        }
    }, []);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    const fetchRoles = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await userService.getRolesPaginated({
                page,
                limit: 10,
                search,
                company_id: appliedFilters.companyId,
                status: appliedFilters.status
            });
            if (response.status === 'success' || response.status === 'Success') {
                setRoles(response.data.result.roles);
                setPagination(response.data.result.pagination);
            }
        } catch (error) {
            console.error('Failed to fetch roles:', error);
        } finally {
            setIsLoading(false);
        }
    }, [page, search, appliedFilters]);

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    const handleFormSubmit = async (values: RolePayload) => {
        try {
            if (selectedRole) {
                await userService.updateRole(selectedRole.id, values);
                showToast('Role updated successfully', 'success');
            } else {
                await userService.createRole(values);
                showToast('Role created successfully', 'success');
            }
            fetchRoles();
        } catch (error) {
            throw error;
        }
    };

    const confirmDelete = async () => {
        if (!roleToDelete) return;
        try {
            await userService.deleteRole(roleToDelete.id);
            showToast('Role deleted successfully', 'success');
            setIsDeleteModalOpen(false);
            setRoleToDelete(null);
            fetchRoles();
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const applyFilters = () => {
        setAppliedFilters({
            companyId,
            status
        });
        setPage(1);
    };

    const resetFilters = () => {
        setCompanyId('');
        setStatus('');
        setAppliedFilters({
            companyId: '',
            status: ''
        });
        setPage(1);
    };

    return (
        <>
            {isMobile ? (
                <Mobile
                    roles={roles} isLoading={isLoading} pagination={pagination}
                    search={search} setSearch={setSearch}
                    page={page} setPage={setPage}
                    onAdd={() => { setSelectedRole(null); setIsModalOpen(true); }}
                    onEdit={(r) => { setSelectedRole(r); setIsModalOpen(true); }}
                    onDelete={(r) => { setRoleToDelete(r); setIsDeleteModalOpen(true); }}
                    onPermissions={(r) => { setSelectedRole(r); setIsPermissionModalOpen(true); }}
                    onDetail={(r) => { setSelectedRole(r); setIsPermissionModalOpen(true); }}
                    onApplyFilters={applyFilters}
                    onResetFilters={resetFilters}
                    appliedFiltersCount={[appliedFilters.companyId, appliedFilters.status].filter(Boolean).length}
                    onOpenFilter={() => {
                        setCompanyId(appliedFilters.companyId);
                        setStatus(appliedFilters.status);
                        setIsFilterModalOpen(true);
                    }}
                    companyId={companyId} setCompanyId={setCompanyId}
                    companies={companies}
                    status={status} setStatus={setStatus}
                    isSuperAdmin={currentUser?.role?.name === "Super Admin"}
                />
            ) : (
                <Desktop
                    roles={roles} isLoading={isLoading} pagination={pagination}
                    search={search} setSearch={setSearch}
                    page={page} setPage={setPage}
                    onAdd={() => { setSelectedRole(null); setIsModalOpen(true); }}
                    onEdit={(r) => { setSelectedRole(r); setIsModalOpen(true); }}
                    onDelete={(r) => { setRoleToDelete(r); setIsDeleteModalOpen(true); }}
                    onPermissions={(r) => { setSelectedRole(r); setIsPermissionModalOpen(true); }}
                    onDetail={(r) => { setSelectedRole(r); setIsPermissionModalOpen(true); }}
                    onOpenFilter={() => {
                        setCompanyId(appliedFilters.companyId);
                        setStatus(appliedFilters.status);
                        setIsFilterModalOpen(true);
                    }}
                    onApplyFilters={applyFilters}
                    onResetFilters={resetFilters}
                    appliedFiltersCount={[appliedFilters.companyId, appliedFilters.status].filter(Boolean).length}
                />
            )}

            <RoleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                role={selectedRole}
                companies={companies}
                isSuperAdmin={currentUser?.role?.name === "Super Admin"}
            />

            <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onReset={() => {
                    resetFilters();
                    setIsFilterModalOpen(false);
                }}
                onApply={() => {
                    applyFilters();
                    setIsFilterModalOpen(false);
                }}
            >
                <RoleFilter
                    companyId={companyId}
                    setCompanyId={setCompanyId}
                    companies={companies}
                    status={status}
                    setStatus={setStatus}
                    isSuperAdmin={currentUser?.role?.name === "Super Admin"}
                />
            </FilterModal>

            <RoleDetailModal
                isOpen={isPermissionModalOpen}
                onClose={() => setIsPermissionModalOpen(false)}
                onSaveSuccess={fetchRoles}
                role={selectedRole}
            />

            <AnimatePresence>
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-md bg-background-dark border border-white/10 rounded-3xl p-8 shadow-2xl text-center">
                            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                                <AlertCircle className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Delete Role?</h3>
                            <p className="text-gray-400 mb-8">Are you sure you want to delete <span className="text-white font-bold">{roleToDelete?.name}</span>?</p>
                            <div className="flex gap-4">
                                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-6 py-3 bg-white/5 text-white rounded-xl font-bold transition-all">Cancel</button>
                                <button onClick={confirmDelete} className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-500/20">Yes, Delete</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};
