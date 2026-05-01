'use client';

import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Role, RolePayload } from '@/lib/modules/users/types';
import {
    X,
    Shield,
    AlignLeft,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (values: RolePayload) => Promise<void>;
    role?: Role | null;
}

export const RoleModal = ({
    isOpen,
    onClose,
    onSubmit,
    role
}: RoleModalProps) => {

    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Role name is required'),
            description: Yup.string().required('Description is required'),
        }),
        onSubmit: async (values) => {
            try {
                await onSubmit(values);
                onClose();
            } catch (error) {
                console.error('Submit error:', error);
            }
        },
    });

    useEffect(() => {
        if (role && isOpen) {
            formik.setValues({
                name: role.name || '',
                description: role.description || '',
            });
        } else if (!role && isOpen) {
            formik.resetForm();
        }
    }, [role, isOpen]);

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
                    className="relative w-full max-w-lg bg-background-dark border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/2">
                        <div>
                            <h3 className="text-xl font-bold text-white">
                                {role ? 'Edit Role' : 'Add New Role'}
                            </h3>
                            <p className="text-sm text-gray-400 mt-1">
                                {role ? 'Update system role and access description.' : 'Define a new role for the system.'}
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
                    <form onSubmit={formik.handleSubmit} className="p-8 space-y-6">
                        <div className="space-y-6">
                            {/* Role Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Role Name</label>
                                <div className="relative group">
                                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                                    <input
                                        name="name"
                                        type="text"
                                        placeholder="e.g. Sales Manager"
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

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Description</label>
                                <div className="relative group">
                                    <AlignLeft className="absolute left-4 top-4 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                                    <textarea
                                        name="description"
                                        rows={4}
                                        placeholder="Briefly describe what this role can do..."
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.description}
                                        className={cn(
                                            "w-full pl-11 pr-4 py-3 bg-white/5 border rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none",
                                            formik.touched.description && formik.errors.description ? "border-red-500/50" : "border-white/10"
                                        )}
                                    />
                                </div>
                                {formik.touched.description && formik.errors.description && <p className="text-xs text-red-500 font-medium">*{formik.errors.description}</p>}
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
                            <span>{role ? 'Update Role' : 'Create Role'}</span>
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
