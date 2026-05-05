'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { userService } from '@/lib/modules/users/services/user.service';
import { Role, PaginationData, RolePayload } from '@/lib/modules/users/types';
import { useToast } from '@/components/ui/Toast';
import { Desktop } from './Desktop';
import { Mobile } from './Mobile';
import { RoleModal } from './RoleModal';
import { RoleDetailModal } from './RoleDetail';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Calendar, Shield } from 'lucide-react';
import { FilterModal } from '@/components/ui/modal';

export const Layout = () => {
    const { showToast } = useToast();

    // State
    const [roles, setRoles] = useState<Role[]>([]);
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

    // Filters
    const [search, setSearch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [page, setPage] = useState(1);
    const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');

    // Responsiveness
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const fetchRoles = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await userService.getRolesPaginated({
                page,
                limit: 10,
                search,
                start_date: startDate,
                end_date: endDate
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
    }, [page, search, startDate, endDate]);

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
                />
            ) : (
                <Desktop
                    roles={roles} isLoading={isLoading} pagination={pagination}
                    search={search} setSearch={setSearch}
                    startDate={startDate} setStartDate={setStartDate}
                    endDate={endDate} setEndDate={setEndDate}
                    page={page} setPage={setPage}
                    onAdd={() => { setSelectedRole(null); setIsModalOpen(true); }}
                    onEdit={(r) => { setSelectedRole(r); setIsModalOpen(true); }}
                    onDelete={(r) => { setRoleToDelete(r); setIsDeleteModalOpen(true); }}
                    onPermissions={(r) => { setSelectedRole(r); setIsPermissionModalOpen(true); }}
                    onDetail={(r) => { setSelectedRole(r); setIsPermissionModalOpen(true); }}
                    onOpenFilter={() => setIsFilterModalOpen(true)}
                />
            )}

            <RoleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                role={selectedRole}
            />

            <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onReset={() => {
                    setStartDate('');
                    setEndDate('');
                    setPage(1);
                }}
                onApply={() => {
                    setPage(1);
                    fetchRoles();
                }}
            >
                <div className="grid grid-cols-1 gap-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-primary uppercase tracking-widest">Created After</label>
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
                            <label className="text-xs font-black text-primary uppercase tracking-widest">Created Before</label>
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
