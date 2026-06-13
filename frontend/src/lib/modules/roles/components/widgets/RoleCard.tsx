'use client';

import React from 'react';
import { Role } from '@/lib/modules/users/types';
import { Shield, ShieldCheck, Edit2, Trash2, Clock, Settings, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import moment from 'moment';
import { Can } from '@/components/auth/Can';
import { cn } from '@/lib/utils';

interface RoleCardProps {
    role: Role;
    onEdit: (role: Role) => void;
    onDelete: (role: Role) => void;
    onPermissions: (role: Role) => void;
    onDetail?: (role: Role) => void;
    isMobile?: boolean;
}

export const RoleCard: React.FC<RoleCardProps> = ({ role, onEdit, onDelete, onPermissions, onDetail, isMobile }) => {
    const isSystemRole = role.name === 'Super Admin' || role.name === 'Admin';

    if (isMobile) {
        return (
            <div className="p-3 bg-white border border-slate-200/80 shadow-xs rounded-xl space-y-3 hover:border-primary/50 transition-all group">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 text-primary border border-slate-200/60 group-hover:scale-110 transition-transform flex items-center justify-center">
                            <Shield className="w-4.5 h-4.5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-800">{role.name}</h4>
                            <p className="text-[10px] text-slate-400       font-medium">
                                Modified {moment(role.created_at).fromNow()}
                            </p>
                            {role.company_name && (
                                <div className="flex items-center gap-1 mt-0.5">
                                    <Building2 className="w-2.5 h-2.5 text-primary/70" />
                                    <span className="text-[10px] text-primary/70 font-bold  ">{role.company_name}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-1">
                        <Can permission="permission.edit">
                            <button onClick={() => onPermissions(role)} className="p-1.5 text-slate-400 hover:text-primary">
                                <ShieldCheck className="w-4 h-4" />
                            </button>
                        </Can>
                        <Can permission="role.edit">
                            <button onClick={() => onEdit(role)} className="p-1.5 text-slate-400 hover:text-slate-800">
                                <Edit2 className="w-4 h-4" />
                            </button>
                        </Can>
                        <button onClick={() => onDetail?.(role)} className="p-1.5 text-slate-400 hover:text-primary">
                            <Settings className="w-4 h-4" />
                        </button>
                        <Can permission="role.delete">
                            <button
                                onClick={() => onDelete(role)}
                                disabled={isSystemRole}
                                className="p-1.5 text-slate-400 hover:text-red-500 disabled:opacity-0"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </Can>
                    </div>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {role.description || 'No description provided.'}
                </p>
                {isSystemRole && (
                    <div className="pt-2 border-t border-slate-200/60">
                        <span className="text-[10px] font-bold text-primary/60 ">System Role</span>
                    </div>
                )}
            </div>
        );
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 hover:border-primary/50 hover:shadow-md transition-all cursor-default overflow-hidden"
        >
            <Shield className="absolute -right-4 -bottom-4 w-24 h-24 text-slate-100/50 -rotate-12 transition-colors" />

            <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-primary border border-slate-200/60 group-hover:scale-110 transition-transform flex items-center justify-center">
                    <Shield className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1">
                    <Can permission="permission.edit">
                        <button
                            onClick={() => onPermissions(role)}
                            className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                            title="Manage Permissions"
                        >
                            <ShieldCheck className="w-4 h-4" />
                        </button>
                    </Can>
                    <Can permission="role.edit">
                        <button
                            onClick={() => onEdit(role)}
                            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-all"
                            title="Edit Role"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                    </Can>
                    <button
                        onClick={() => onDetail?.(role)}
                        className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                        title="Role Matrix Detail"
                    >
                        <Settings className="w-4 h-4" />
                    </button>
                    <Can permission="role.delete">
                        <button
                            onClick={() => onDelete(role)}
                            disabled={isSystemRole}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all disabled:opacity-0"
                            title="Delete Role"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </Can>
                </div>
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-1 transition-colors">{role.name}</h3>
            <p className="text-sm text-slate-500 line-clamp-2 mb-2">
                {role.description || 'No description provided.'}
            </p>

            <div className="flex flex-col gap-1">
                {role.company_name && (
                    <div className="flex items-center gap-1.5 text-primary  font-bold text-[10px] bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10 w-fit">
                        <Building2 className="w-3 h-3" />
                        <span>{role.company_name}</span>
                    </div>
                )}
            </div>
            {isSystemRole && (
                <div className="mt-3 pt-2.5 border-t border-slate-200/60">
                    <span className="text-[10px] font-bold text-primary/60 ">System Role</span>
                </div>
            )}
        </motion.div>
    );
};
