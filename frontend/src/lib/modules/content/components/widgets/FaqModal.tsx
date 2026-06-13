import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { HelpCircle, Loader2 } from 'lucide-react';
import { BaseModal } from '@/components/ui/modal';
import { InputText, InputTextArea } from '@/components/ui/input';
import { LandingFaq } from '../../types';

interface FaqModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (values: Partial<LandingFaq>) => Promise<void>;
    item?: LandingFaq | null;
}

export const FaqModal = ({ isOpen, onClose, onSubmit, item }: FaqModalProps) => {
    const formik = useFormik({
        initialValues: {
            title: '',
            subtitle: '',
        },
        validationSchema: Yup.object({
            title: Yup.string().required('Question is required'),
            subtitle: Yup.string().required('Answer is required'),
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
                title: item.title || '',
                subtitle: item.subtitle || '',
            });
        } else if (!item && isOpen) {
            formik.resetForm();
        }
    }, [item, isOpen]);

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={item ? 'Edit FAQ' : 'Add FAQ'}
            description={item ? 'Update question and answer details.' : 'Add a new frequently asked question.'}
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
                        <span>{item ? 'Update' : 'Add'}</span>
                    </button>
                </>
            }
        >
            <form className="space-y-6">
                <div className="space-y-4">
                    <InputText
                        label="Question"
                        name="title"
                        icon={HelpCircle}
                        placeholder="e.g. How to get started?"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.title}
                        error={formik.errors.title}
                        touched={formik.touched.title}
                    />

                    <InputTextArea
                        label="Answer"
                        name="subtitle"
                        placeholder="Provide a detailed answer here..."
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.subtitle}
                        error={formik.errors.subtitle}
                        touched={formik.touched.subtitle}
                    />
                </div>
            </form>
        </BaseModal>
    );
};
