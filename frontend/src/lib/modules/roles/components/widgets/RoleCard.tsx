'use client';

import React from 'react';
import { Role } from '@/lib/modules/users/types';
import { Shield, ShieldCheck, Edit2, Trash2, Clock, Settings } from 'lucide-react';
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
            <div className="p-4 bg-background-dark border border-white/5 rounded-2xl space-y-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white">{role.name}</h4>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">
                                Modified {moment(role.created_at).fromNow()}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-1">
                        <Can permission="permission.edit">
                            <button onClick={() => onPermissions(role)} className="p-2 text-gray-400 hover:text-primary">
                                <ShieldCheck className="w-4 h-4" />
                            </button>
                        </Can>
                        <Can permission="role.edit">
                            <button onClick={() => onEdit(role)} className="p-2 text-gray-400 hover:text-white">
                                <Edit2 className="w-4 h-4" />
                            </button>
                        </Can>
                        <button onClick={() => onDetail?.(role)} className="p-2 text-gray-400 hover:text-primary">
                            <Settings className="w-4 h-4" />
                        </button>
                        <Can permission="role.delete">
                            <button 
                                onClick={() => onDelete(role)} 
                                disabled={isSystemRole}
                                className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-0"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </Can>
                    </div>
                </div>
                <p className="text-xs text-gray-400 line-clamp-2">
                    {role.description || 'No description provided.'}
                </p>
                {isSystemRole && (
                    <div className="pt-2 border-t border-white/5">
                        <span className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">System Role</span>
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
            className="group relative bg-background-dark/50 border border-white/5 rounded-2xl p-6 hover:border-primary/30 transition-all hover:shadow-2xl hover:shadow-primary/5 cursor-default overflow-hidden"
        >
            <Shield className="absolute -right-4 -bottom-4 w-24 h-24 text-white/2 -rotate-12 group-hover:text-primary/5 transition-colors" />

            <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    <Shield className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1">
                    <Can permission="permission.edit">
                        <button
                            onClick={() => onPermissions(role)}
                            className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                            title="Manage Permissions"
                        >
                            <ShieldCheck className="w-4 h-4" />
                        </button>
                    </Can>
                    <Can permission="role.edit">
                        <button
                            onClick={() => onEdit(role)}
                            className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                            title="Edit Role"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                    </Can>
                    <button
                        onClick={() => onDetail?.(role)}
                        className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                        title="Role Matrix Detail"
                    >
                        <Settings className="w-4 h-4" />
                    </button>
                    <Can permission="role.delete">
                        <button
                            onClick={() => onDelete(role)}
                            disabled={isSystemRole}
                            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-0"
                            title="Delete Role"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </Can>
                </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">{role.name}</h3>
            <p className="text-sm text-gray-400 line-clamp-2 min-h-[40px] mb-4">
                {role.description || 'No description provided.'}
            </p>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    <span>Modified {moment(role.created_at).fromNow()}</span>
                </div>
                {isSystemRole && (
                    <span className="text-primary/60">System Role</span>
                )}
            </div>
        </motion.div>
    );
};
