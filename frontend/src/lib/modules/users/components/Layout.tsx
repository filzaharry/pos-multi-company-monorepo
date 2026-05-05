'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { userService } from '@/lib/modules/users/services/user.service';
import { User } from '@/lib/modules/login/types';
import { Company, PaginationData, Role, UserPayload } from '@/lib/modules/users/types';
import { useLogin } from '@/lib/modules/login/store/useLogin';
import { UserModal } from '@/lib/modules/users/components/widget/UserModal';
import { useToast } from '@/components/ui/Toast';
import { Desktop } from './Desktop';
import { Mobile } from './Mobile';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Building2, Calendar, Shield } from 'lucide-react';
import { FilterModal } from '@/components/ui/modal';

export const Layout = () => {
    const { user: currentUser } = useLogin();
    const { showToast } = useToast();

    // State
    const [users, setUsers] = useState<User[]>([]);
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [roles, setRoles] = useState<Role[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    // Filters
    const [search, setSearch] = useState('');
    const [roleId, setRoleId] = useState('');
    const [companyId, setCompanyId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [page, setPage] = useState(1);
    const [sortKey, setSortKey] = useState<string>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const isSuperAdmin = currentUser?.role?.name === 'Super Admin';

    // Responsiveness
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const fetchInitialData = useCallback(async () => {
        try {
            const [rolesRes, companiesRes] = await Promise.all([
                userService.getRoles(),
                userService.getCompanies()
            ]);
            if (rolesRes.status === 'success' || rolesRes.status === 'Success') setRoles(rolesRes.data.result);
            if (companiesRes.status === 'success' || companiesRes.status === 'Success') setCompanies(companiesRes.data.result);
        } catch (error) {
            console.error('Failed to fetch initial data:', error);
        }
    }, []);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await userService.getUsers({
                page,
                limit: 10,
                search,
                role_id: roleId,
                company_id: companyId,
                start_date: startDate,
                end_date: endDate,
                sort_key: sortKey,
                sort_order: sortOrder
            });
            if (response.status === 'success' || response.status === 'Success') {
                setUsers(response.data.result.users);
                setPagination(response.data.result.pagination);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setIsLoading(false);
        }
    }, [page, search, roleId, companyId, startDate, endDate, sortKey, sortOrder]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleFormSubmit = async (values: UserPayload) => {
        try {
            if (selectedUser) {
                await userService.updateUser(selectedUser.id, values);
                showToast('User updated successfully', 'success');
            } else {
                await userService.createUser(values);
                showToast('User created successfully', 'success');
            }
            fetchUsers();
        } catch (error) {
            throw error;
        }
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;
        try {
            await userService.deleteUser(userToDelete.id);
            showToast('User deleted successfully', 'success');
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
            fetchUsers();
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    return (
        <>
            {isMobile ? (
                <Mobile
                    users={users} isLoading={isLoading} pagination={pagination}
                    roles={roles} companies={companies} isSuperAdmin={isSuperAdmin}
                    search={search} setSearch={setSearch}
                    roleId={roleId} setRoleId={setRoleId}
                    companyId={companyId} setCompanyId={setCompanyId}
                    page={page} setPage={setPage}
                    onAdd={() => { setSelectedUser(null); setIsModalOpen(true); }}
                    onEdit={(u) => { setSelectedUser(u); setIsModalOpen(true); }}
                    onDelete={(u) => { setUserToDelete(u); setIsDeleteModalOpen(true); }}
                />
            ) : (
                <Desktop
                    users={users} isLoading={isLoading} pagination={pagination}
                    roles={roles} companies={companies} isSuperAdmin={isSuperAdmin}
                    search={search} setSearch={setSearch}
                    roleId={roleId} setRoleId={setRoleId}
                    companyId={companyId} setCompanyId={setCompanyId}
                    startDate={startDate} setStartDate={setStartDate}
                    endDate={endDate} setEndDate={setEndDate}
                    page={page} setPage={setPage}
                    sortKey={sortKey} sortOrder={sortOrder}
                    onSort={(key) => {
                        if (sortKey === key) {
                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        } else {
                            setSortKey(key);
                            setSortOrder('asc');
                        }
                    }}
                    onAdd={() => { setSelectedUser(null); setIsModalOpen(true); }}
                    onEdit={(u) => { setSelectedUser(u); setIsModalOpen(true); }}
                    onDelete={(u) => { setUserToDelete(u); setIsDeleteModalOpen(true); }}
                    onOpenFilter={() => setIsFilterModalOpen(true)}
                />
            )}

            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                user={selectedUser}
                roles={roles}
                companies={companies}
                isSuperAdmin={isSuperAdmin}
            />

            <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onReset={() => {
                    setRoleId('');
                    setCompanyId('');
                    setStartDate('');
                    setEndDate('');
                    setPage(1);
                }}
                onApply={() => {
                    setPage(1);
                    fetchUsers();
                }}
            >
                <div className="grid grid-cols-1 gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-primary uppercase tracking-widest">Role</label>
                            <div className="relative">
                                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <select
                                    value={roleId}
                                    onChange={(e) => setRoleId(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
                                >
                                    <option value="" className="bg-background-dark text-gray-400">All Roles</option>
                                    {roles.map(role => (
                                        <option key={role.id} value={role.id.toString()} className="bg-background-dark text-white">{role.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

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
                                        <option value="" className="bg-background-dark text-gray-400">All Companies</option>
                                        {companies.map(company => (
                                            <option key={company.id} value={company.id.toString()} className="bg-background-dark text-white">{company.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-primary uppercase tracking-widest">Joined After</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-primary uppercase tracking-widest">Joined Before</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </FilterModal>

            <AnimatePresence>
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-md bg-background-dark border border-white/10 rounded-3xl p-8 shadow-2xl text-center">
                            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                                <AlertCircle className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Delete User?</h3>
                            <p className="text-gray-400 mb-8">Are you sure you want to delete <span className="text-white font-bold">{userToDelete?.name}</span>?</p>
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
