'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { userService } from '@/lib/modules/users/services/user.service';
import { Role, Permission } from '@/lib/modules/users/types';
import {
    X,
    ShieldCheck,
    Save,
    Loader2,
    Search,
    Check,
    Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';
import { motion, AnimatePresence } from 'framer-motion';

interface PermissionMatrixModalProps {
    isOpen: boolean;
    onClose: () => void;
    role: Role | null;
    onSaveSuccess?: () => void;
}

export const PermissionMatrixModal = ({
    isOpen,
    onClose,
    role,
    onSaveSuccess
}: PermissionMatrixModalProps) => {
    const { showToast } = useToast();
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [search, setSearch] = useState('');

    // Local state to track which permission IDs are checked
    const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());

    const fetchData = useCallback(async () => {
        if (!isOpen || !role) return;
        setIsLoading(true);
        try {
            // Get all available system permissions
            const permsRes = await userService.getPermissions();
            setPermissions(permsRes.data);

            // Fetch the role again specifically to get preloaded permissions
            // or just use role.permissions if we're sure it's up to date.
            // Since we preloaded in the list, we can use it, but to be safe, 
            // especially after saves, let's use what's passed from the list 
            // and assume the list is refreshed.
            setCheckedIds(new Set(role.permissions?.map(p => p.id) || []));
        } catch (error) {
            console.error('Failed to fetch permissions:', error);
            showToast('Failed to load permissions', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [isOpen, role, showToast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleToggle = (permId: number) => {
        if (role?.name === 'Super Admin') return; // Cannot modify Super Admin

        setCheckedIds(prev => {
            const next = new Set(prev);
            if (next.has(permId)) {
                next.delete(permId);
            } else {
                next.add(permId);
            }
            return next;
        });
    };

    const handleSave = async () => {
        if (!role) return;
        setIsSaving(true);
        try {
            const permissionIds = Array.from(checkedIds);
            await userService.updateRolePermissions(role.id, permissionIds);
            showToast('Permissions synced with database successfully', 'success');
            if (onSaveSuccess) onSaveSuccess();
            onClose();
        } catch (error) {
            console.error('Save failed:', error);
        } finally {
            setIsSaving(false);
        }
    };

    // Grouping for table rows
    const groupedPermissions = permissions.reduce((acc, perm) => {
        if (!acc[perm.group_name]) acc[perm.group_name] = [];
        acc[perm.group_name].push(perm);
        return acc;
    }, {} as Record<string, Permission[]>);

    const filteredGroups = Object.keys(groupedPermissions).filter(groupName => {
        if (!search) return true;
        return groupName.toLowerCase().includes(search.toLowerCase()) ||
            groupedPermissions[groupName].some(p => p.name.toLowerCase().includes(search.toLowerCase()));
    });

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 30 }}
                        className="relative w-full max-w-5xl bg-background-dark border border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/2">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        Role Permissions: <span className="text-primary">{role?.name}</span>
                                    </h3>
                                    <p className="text-xs text-gray-400">
                                        Mapping permissions to <code className="text-primary/70 font-mono">role_permissions</code> table.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="text"
                                        placeholder="Quick search..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-gray-600"
                                    />
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Matrix Content (TABLE) */}
                        <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 z-20 bg-background-dark/95 backdrop-blur-sm shadow-sm border-b border-white/5">
                                    <tr>
                                        <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest min-w-[300px]">Permission Modules</th>
                                        <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center min-w-[200px]">Akses Status</th>
                                        <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest min-w-[200px]">Slug Reference</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        [...Array(6)].map((_, i) => (
                                            <tr key={i} className="animate-pulse border-b border-white/5">
                                                <td className="px-8 py-6"><div className="h-4 w-48 bg-white/5 rounded" /></td>
                                                <td className="px-8 py-6"><div className="h-6 w-6 mx-auto bg-white/5 rounded-lg" /></td>
                                                <td className="px-8 py-6"><div className="h-4 w-32 bg-white/5 rounded" /></td>
                                            </tr>
                                        ))
                                    ) : filteredGroups.map((groupName) => (
                                        <React.Fragment key={groupName}>
                                            {/* Module divider row */}
                                            <tr className="bg-white/3 border-y border-white/5">
                                                <td colSpan={3} className="px-8 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1.5 h-4 bg-primary rounded-full shadow-[0_0_10px_rgba(71,140,209,0.5)]" />
                                                        <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">{groupName}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                            {/* Permission rows */}
                                            {groupedPermissions[groupName]
                                                .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))
                                                .map((perm) => {
                                                    const isChecked = checkedIds.has(perm.id);
                                                    const isSystemProtected = (role?.name === 'Super Admin');

                                                    return (
                                                        <tr key={perm.id} className="border-b border-white/5 hover:bg-white/2 transition-colors group">
                                                            <td className="px-8 py-4">
                                                                <span className="text-sm font-medium text-white group-hover:text-primary transition-colors">
                                                                    {perm.name}
                                                                </span>
                                                            </td>
                                                            <td className="px-8 py-4">
                                                                <button
                                                                    onClick={() => handleToggle(perm.id)}
                                                                    disabled={isSystemProtected}
                                                                    className={cn(
                                                                        "w-6 h-6 rounded-lg border-2 flex items-center justify-center mx-auto transition-all",
                                                                        isChecked
                                                                            ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                                                                            : "border-white/10 hover:border-white/30",
                                                                        isSystemProtected && "opacity-50 cursor-not-allowed grayscale"
                                                                    )}
                                                                >
                                                                    {isChecked && <Check className="w-4 h-4" />}
                                                                    {isSystemProtected && !isChecked && <Lock className="w-3 h-3 text-gray-500" />}
                                                                </button>
                                                            </td>
                                                            <td className="px-8 py-4">
                                                                <span className="text-[10px] text-gray-600 font-mono py-1 px-2 bg-white/5 rounded-md">
                                                                    {perm.slug}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer */}
                        <div className="px-8 py-6 border-t border-white/5 bg-white/1 flex items-center justify-between gap-4">
                            <div className="text-xs text-gray-500 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-orange-400" />
                                <span>Changes affect all users with this role in real-time.</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-2.5 text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    disabled={isSaving || role?.name === 'Super Admin'}
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-8 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                                >
                                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                                    <Save className="w-4 h-4" />
                                    <span>Sync Database</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

const AlertCircle = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
);
