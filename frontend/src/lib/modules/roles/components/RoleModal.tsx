import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Role, RolePayload } from '@/lib/modules/users/types';
import {
    Shield,
    AlignLeft,
    Loader2
} from 'lucide-react';
import { BaseModal } from '@/components/ui/modal/BaseModal';
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

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={role ? 'Edit Role' : 'Add New Role'}
            description={role ? 'Update system role and access description.' : 'Define a new role for the system.'}
            footer={
                <div className="flex items-center justify-end gap-4">
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
            }
        >
            <div className="space-y-6">
                {/* Role Name */}
                <div className="space-y-2">
                    <label className="text-xs font-black text-primary uppercase tracking-widest">Role Name</label>
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
                                "w-full pl-11 pr-4 py-3 bg-white/5 border rounded-2xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-gray-600 shadow-inner",
                                formik.touched.name && formik.errors.name ? "border-red-500/50" : "border-white/10"
                            )}
                        />
                    </div>
                    {formik.touched.name && formik.errors.name && <p className="text-xs text-red-500 font-medium">*{formik.errors.name}</p>}
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="text-xs font-black text-primary uppercase tracking-widest">Description</label>
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
                                "w-full pl-11 pr-4 py-3 bg-white/5 border rounded-2xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none placeholder:text-gray-600 shadow-inner",
                                formik.touched.description && formik.errors.description ? "border-red-500/50" : "border-white/10"
                            )}
                        />
                    </div>
                    {formik.touched.description && formik.errors.description && <p className="text-xs text-red-500 font-medium">*{formik.errors.description}</p>}
                </div>
            </div>
        </BaseModal>
    );
};
