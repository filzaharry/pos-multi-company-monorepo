import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, DollarSign, Type, FileText, Loader2 } from 'lucide-react';
import { BaseModal } from '@/components/ui/modal';
import { CustomInput } from '@/components/ui/CustomInput';
import { LandingPackage } from '../../types';

interface PackageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (values: Partial<LandingPackage>) => Promise<void>;
    item?: LandingPackage | null;
}

export const PackageModal = ({ isOpen, onClose, onSubmit, item }: PackageModalProps) => {
    const formik = useFormik({
        initialValues: {
            name: '',
            pricing: 0,
            description: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            pricing: Yup.number().required('Price is required').min(0, 'Price must be positive'),
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
        if (item && isOpen) {
            formik.setValues({
                name: item.name || '',
                pricing: item.pricing || 0,
                description: item.description || '',
            });
        } else if (!item && isOpen) {
            formik.resetForm();
        }
    }, [item, isOpen]);

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={item ? 'Edit Package' : 'Create Package'}
            description={item ? 'Update package details and pricing.' : 'Add a new service package to your landing page.'}
            footer={
                <>
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
                        <span>{item ? 'Update' : 'Create'}</span>
                    </button>
                </>
            }
        >
            <form className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Package Name</label>
                        <CustomInput
                            name="name"
                            icon={Box}
                            placeholder="e.g. Basic Plan"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.name}
                            className={formik.touched.name && formik.errors.name ? "border-red-500/50" : "border-white/10"}
                        />
                        {formik.touched.name && formik.errors.name && <p className="text-xs text-red-500 font-medium">*{formik.errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Pricing (IDR)</label>
                        <CustomInput
                            name="pricing"
                            type="number"
                            icon={DollarSign}
                            placeholder="e.g. 100000"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.pricing}
                            className={formik.touched.pricing && formik.errors.pricing ? "border-red-500/50" : "border-white/10"}
                        />
                        {formik.touched.pricing && formik.errors.pricing && <p className="text-xs text-red-500 font-medium">*{formik.errors.pricing}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Description</label>
                        <textarea
                            name="description"
                            placeholder="What's included in this package?"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.description}
                            className="w-full px-6 py-4 bg-background-dark border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all min-h-[120px] resize-none"
                        />
                        {formik.touched.description && formik.errors.description && <p className="text-xs text-red-500 font-medium">*{formik.errors.description}</p>}
                    </div>
                </div>
            </form>
        </BaseModal>
    );
};
