import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Role, RolePayload } from '@/lib/modules/users/types';
import { Shield, AlignLeft, Loader2, Building2 } from 'lucide-react';
import { BaseModal } from '@/components/ui/modal/BaseModal';
import { LookupOption } from '@/lib/modules/users/types';
import { InputText, InputDropdown, InputTextArea } from '@/components/ui/input';

interface RoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (values: RolePayload) => Promise<void>;
    role?: Role | null;
    companies: LookupOption[];
    isSuperAdmin: boolean;
}

export const RoleModal = ({
    isOpen,
    onClose,
    onSubmit,
    role,
    companies,
    isSuperAdmin
}: RoleModalProps) => {

    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            company_id: '' as string | number,
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Role name is required'),
            description: Yup.string().required('Description is required'),
            company_id: Yup.mixed().when([], {
                is: () => isSuperAdmin,
                then: (schema) => schema.required('Company is required'),
                otherwise: (schema) => schema.notRequired()
            })
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const payload = {
                    ...values,
                    company_id: values.company_id ? Number(values.company_id) : undefined
                };
                await onSubmit(payload as RolePayload);
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
                company_id: role.company_id || '',
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
                <InputText
                    label="Role Name"
                    name="name"
                    icon={Shield}
                    placeholder="e.g. Sales Manager"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    error={formik.errors.name}
                    touched={formik.touched.name}
                />

                {/* Company Dropdown (Super Admin only) */}
                {isSuperAdmin && (
                    <InputDropdown
                        label="Company"
                        name="company_id"
                        value={formik.values.company_id}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.errors.company_id as string}
                        touched={formik.touched.company_id}
                        placeholder="Select Company"
                    >
                        {companies.map((company) => (
                            <option key={company.value} value={company.value}>
                                {company.label}
                            </option>
                        ))}
                    </InputDropdown>
                )}

                {/* Description */}
                <InputTextArea
                    label="Description"
                    name="description"
                    icon={AlignLeft}
                    placeholder="Briefly describe what this role can do..."
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.description}
                    error={formik.errors.description}
                    touched={formik.touched.description}
                />
            </div>
        </BaseModal>
    );
};
