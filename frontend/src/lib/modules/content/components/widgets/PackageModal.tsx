import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Loader2 } from 'lucide-react';
import { BaseModal } from '@/components/ui/modal';
import { InputText, InputCurrency, InputTextArea } from '@/components/ui/input';
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
                    <InputText
                        label="Package Name"
                        name="name"
                        icon={Box}
                        placeholder="e.g. Basic Plan"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                        error={formik.errors.name}
                        touched={formik.touched.name}
                    />

                    <InputCurrency
                        label="Pricing (IDR)"
                        name="pricing"
                        currencySymbol="Rp"
                        placeholder="e.g. 100000"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.pricing}
                        error={formik.errors.pricing}
                        touched={formik.touched.pricing}
                    />

                    <InputTextArea
                        label="Description"
                        name="description"
                        placeholder="What's included in this package?"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.description}
                        error={formik.errors.description}
                        touched={formik.touched.description}
                    />
                </div>
            </form>
        </BaseModal>
    );
};
