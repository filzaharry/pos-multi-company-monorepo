import React, { useState, useEffect, useCallback } from 'react';
import { Role, Permission } from '@/lib/modules/users/types';
import { userService } from '@/lib/modules/users/services/user.service';
import {
    Shield,
    ShieldCheck,
    Search,
    Check,
    Lock,
    Save,
    Loader2,
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';
import { BaseModal } from '@/components/ui/modal/BaseModal';

interface RoleDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    role: Role | null;
    onSaveSuccess?: () => void;
}

export const RoleDetailModal: React.FC<RoleDetailModalProps> = ({ isOpen, onClose, role, onSaveSuccess }) => {
    const { showToast } = useToast();
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [search, setSearch] = useState('');
    const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());

    const fetchData = useCallback(async () => {
        if (!isOpen || !role) return;
        setIsLoading(true);
        try {
            const permsRes = await userService.getPermissions();
            if (permsRes.data && permsRes.data.result) {
                setPermissions(permsRes.data.result);
            }
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
        if (!role || role.name === 'Super Admin') return;

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
            showToast('Permissions updated successfully', 'success');
            if (onSaveSuccess) onSaveSuccess();
            onClose();
        } catch (error) {
            console.error('Save failed:', error);
        } finally {
            setIsSaving(false);
        }
    };

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

    if (!role) return null;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={`${role.name} Permissions`}
            description={role.description || 'Manage module-based access control for this role.'}
            size="3xl"
            footer={
                <div className="flex items-center justify-between w-full gap-4">
                    <div className="hidden md:flex items-center gap-2 text-xs text-gray-500 font-medium">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        <span>Changes apply immediately to all assigned users.</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving || role.name === 'Super Admin'}
                            className="flex items-center gap-2 px-8 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            <span>Save Changes</span>
                        </button>
                    </div>
                </div>
            }
        >
            <div className="space-y-6">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search permissions or modules..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-600 shadow-inner"
                    />
                </div>

                <div className="bg-white/2 border border-white/5 rounded-3xl overflow-hidden max-h-[50vh] overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead className="sticky top-0 z-10 bg-background-dark/95 backdrop-blur-sm border-b border-white/5">
                            <tr>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Permission Name</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-center">Status</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Slug</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse border-b border-white/5">
                                        <td className="px-8 py-6"><div className="h-4 w-48 bg-white/5 rounded" /></td>
                                        <td className="px-8 py-6"><div className="h-6 w-6 mx-auto bg-white/5 rounded-lg" /></td>
                                        <td className="px-8 py-6"><div className="h-4 w-32 bg-white/5 rounded" /></td>
                                    </tr>
                                ))
                            ) : filteredGroups.map((groupName) => (
                                <React.Fragment key={groupName}>
                                    <tr className="bg-primary/5">
                                        <td colSpan={3} className="px-8 py-2 border-b border-white/5">
                                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{groupName}</span>
                                        </td>
                                    </tr>
                                    {groupedPermissions[groupName]
                                        .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))
                                        .map((perm) => (
                                            <tr key={perm.id} className="border-b border-white/5 hover:bg-white/2 transition-colors group">
                                                <td className="px-8 py-4">
                                                    <span className="text-sm font-medium text-white group-hover:text-primary transition-colors">{perm.name}</span>
                                                </td>
                                                <td className="px-8 py-4">
                                                    <button
                                                        onClick={() => handleToggle(perm.id)}
                                                        disabled={role.name === 'Super Admin'}
                                                        className={cn(
                                                            "w-6 h-6 rounded-lg border-2 flex items-center justify-center mx-auto transition-all",
                                                            checkedIds.has(perm.id)
                                                                ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                                                                : "border-white/10 hover:border-white/30",
                                                            role.name === 'Super Admin' && "opacity-50 cursor-not-allowed grayscale"
                                                        )}
                                                    >
                                                        {checkedIds.has(perm.id) ? <Check className="w-4 h-4" /> : (role.name === 'Super Admin' && <Lock className="w-3 h-3 text-gray-500" />)}
                                                    </button>
                                                </td>
                                                <td className="px-8 py-4">
                                                    <span className="text-[10px] text-gray-600 font-mono py-1 px-2 bg-white/5 rounded">
                                                        {perm.slug}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </BaseModal>
    );
};
