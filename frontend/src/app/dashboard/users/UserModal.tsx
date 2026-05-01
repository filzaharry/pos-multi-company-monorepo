'use client';

import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { User } from '@/lib/modules/login/types';
import { Role, Company, UserPayload } from '@/lib/modules/users/types';
import {
    X,
    User as UserIcon,
    Mail,
    Phone,
    Lock,
    Shield,
    Building2,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (values: UserPayload) => Promise<void>;
    user?: User | null;
    roles: Role[];
    companies: Company[];
    isSuperAdmin: boolean;
}

export const UserModal = ({
    isOpen,
    onClose,
    onSubmit,
    user,
    roles,
    companies,
    isSuperAdmin
}: UserModalProps) => {

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            phone: '',
            password: '',
            role_id: '',
            company_id: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            email: Yup.string().email('Invalid email').required('Email is required'),
            phone: Yup.string().required('Phone is required'),
            password: Yup.string().when('isEdit', {
                is: () => !user,
                then: () => Yup.string().required('Password is required').min(6, 'Min 6 characters'),
                otherwise: () => Yup.string().min(6, 'Min 6 characters').optional(),
            }),
            role_id: Yup.string().required('Role is required'),
            company_id: isSuperAdmin ? Yup.string().required('Company is required') : Yup.string().optional(),
        }),
        onSubmit: async (values) => {
            try {
                // Convert IDs back to numbers
                const payload = {
                    ...values,
                    role_id: parseInt(values.role_id),
                    company_id: values.company_id ? parseInt(values.company_id) : undefined
                };
                await onSubmit(payload);
                onClose();
            } catch (error) {
                console.error('Submit error:', error);
            }
        },
    });

    useEffect(() => {
        if (user && isOpen) {
            formik.setValues({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                password: '',
                role_id: user.role?.id.toString() || '',
                company_id: user.company_id?.toString() || '',
            });
        } else if (!user && isOpen) {
            formik.resetForm();
        }
    }, [user, isOpen]);

    if (!isOpen) return <AnimatePresence />;

    return (
        <AnimatePresence mode="wait">
            <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-xl bg-background-dark border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/2">
                        <div>
                            <h3 className="text-xl font-bold text-white">
                                {user ? 'Edit User' : 'Add New User'}
                            </h3>
                            <p className="text-sm text-gray-400 mt-1">
                                {user ? 'Update existing member information.' : 'Invite a new member to the system.'}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={formik.handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scroll">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Full Name</label>
                                <div className="relative group">
                                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                                    <input
                                        name="name"
                                        type="text"
                                        placeholder="John Doe"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.name}
                                        className={cn(
                                            "w-full pl-11 pr-4 py-3 bg-white/5 border rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all",
                                            formik.touched.name && formik.errors.name ? "border-red-500/50" : "border-white/10"
                                        )}
                                    />
                                </div>
                                {formik.touched.name && formik.errors.name && <p className="text-xs text-red-500 font-medium">*{formik.errors.name}</p>}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.email}
                                        className={cn(
                                            "w-full pl-11 pr-4 py-3 bg-white/5 border rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all",
                                            formik.touched.email && formik.errors.email ? "border-red-500/50" : "border-white/10"
                                        )}
                                    />
                                </div>
                                {formik.touched.email && formik.errors.email && <p className="text-xs text-red-500 font-medium">*{formik.errors.email}</p>}
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Phone Number</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                                    <input
                                        name="phone"
                                        type="text"
                                        placeholder="0812..."
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.phone}
                                        className={cn(
                                            "w-full pl-11 pr-4 py-3 bg-white/5 border rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all",
                                            formik.touched.phone && formik.errors.phone ? "border-red-500/50" : "border-white/10"
                                        )}
                                    />
                                </div>
                                {formik.touched.phone && formik.errors.phone && <p className="text-xs text-red-500 font-medium">*{formik.errors.phone}</p>}
                            </div>

                            {/* Role */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Role</label>
                                <div className="relative group">
                                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors pointer-events-none" />
                                    <select
                                        name="role_id"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.role_id}
                                        className={cn(
                                            "w-full pl-11 pr-4 py-1.5 bg-background-dark border rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all appearance-none min-h-[46px]",
                                            formik.touched.role_id && formik.errors.role_id ? "border-red-500/50" : "border-white/10"
                                        )}
                                    >
                                        <option value="" className="bg-background-dark">Select Role</option>
                                        {roles.map(r => (
                                            <option key={r.id} value={r.id} className="bg-background-dark">{r.name}</option>
                                        ))}
                                    </select>
                                </div>
                                {formik.touched.role_id && formik.errors.role_id && <p className="text-xs text-red-500 font-medium">*{formik.errors.role_id}</p>}
                            </div>

                            {/* Company (Super Admin only) */}
                            {isSuperAdmin && (
                                <div className="space-y-2 col-span-1 md:col-span-2">
                                    <label className="text-sm font-medium text-gray-300">Assign Company</label>
                                    <div className="relative group">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors pointer-events-none" />
                                        <select
                                            name="company_id"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.company_id}
                                            className={cn(
                                                "w-full pl-11 pr-4 py-1.5 bg-background-dark border rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all appearance-none min-h-[46px]",
                                                formik.touched.company_id && formik.errors.company_id ? "border-red-500/50" : "border-white/10"
                                            )}
                                        >
                                            <option value="" className="bg-background-dark">Select Company</option>
                                            {companies.map(c => (
                                                <option key={c.id} value={c.id} className="bg-background-dark">{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {formik.touched.company_id && formik.errors.company_id && <p className="text-xs text-red-500 font-medium">*{formik.errors.company_id}</p>}
                                </div>
                            )}

                            {/* Password */}
                            <div className="space-y-2 col-span-1 md:col-span-2">
                                <label className="text-sm font-medium text-gray-300">
                                    {user ? 'New Password (Leave blank to keep current)' : 'Password'}
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                                    <input
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.password}
                                        className={cn(
                                            "w-full pl-11 pr-4 py-3 bg-white/5 border rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all",
                                            formik.touched.password && formik.errors.password ? "border-red-500/50" : "border-white/10"
                                        )}
                                    />
                                </div>
                                {formik.touched.password && formik.errors.password && <p className="text-xs text-red-500 font-medium">*{formik.errors.password}</p>}
                            </div>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="px-8 py-6 border-t border-white/5 bg-white/1 flex items-center justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={formik.isSubmitting}
                            onClick={() => formik.submitForm()}
                            className="flex items-center gap-2 px-8 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                        >
                            {formik.isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            <span>{user ? 'Update User' : 'Create User'}</span>
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
