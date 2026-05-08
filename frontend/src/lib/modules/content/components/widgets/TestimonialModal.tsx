import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { User, Star, Quote, Loader2, Building2 } from 'lucide-react';
import { BaseModal } from '@/components/ui/modal';
import { CustomInput } from '@/components/ui/CustomInput';
import { LandingTestimonial } from '../../types';

interface TestimonialModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (values: Partial<LandingTestimonial>) => Promise<void>;
    item?: LandingTestimonial | null;
}

export const TestimonialModal = ({ isOpen, onClose, onSubmit, item }: TestimonialModalProps) => {
    const formik = useFormik({
        initialValues: {
            name: '',
            content: '',
            rating: 5,
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            content: Yup.string().required('Content is required'),
            rating: Yup.number().required('Rating is required').min(1).max(5),
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
                content: item.content || '',
                rating: item.rating || 5,
            });
        } else if (!item && isOpen) {
            formik.resetForm();
        }
    }, [item, isOpen]);

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={item ? 'Edit Testimonial' : 'Add Testimonial'}
            description={item ? 'Update client feedback and rating.' : 'Add a new client testimonial to your landing page.'}
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
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Author Name</label>
                        <CustomInput
                            name="name"
                            icon={User}
                            placeholder="e.g. John Doe"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.name}
                            className={formik.touched.name && formik.errors.name ? "border-red-500/50" : "border-white/10"}
                        />
                        {formik.touched.name && formik.errors.name && <p className="text-xs text-red-500 font-medium">*{formik.errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Rating (1-5)</label>
                        <CustomInput
                            name="rating"
                            type="number"
                            icon={Star}
                            min="1"
                            max="5"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.rating}
                            className={formik.touched.rating && formik.errors.rating ? "border-red-500/50" : "border-white/10"}
                        />
                        {formik.touched.rating && formik.errors.rating && <p className="text-xs text-red-500 font-medium">*{formik.errors.rating}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Content</label>
                        <div className="relative">
                            <Quote className="absolute left-4 top-4 w-4 h-4 text-gray-500" />
                            <textarea
                                name="content"
                                placeholder="What did they say about us?"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.content}
                                className="w-full pl-11 pr-4 py-4 bg-background-dark border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all min-h-[120px] resize-none"
                            />
                        </div>
                        {formik.touched.content && formik.errors.content && <p className="text-xs text-red-500 font-medium">*{formik.errors.content}</p>}
                    </div>
                </div>
            </form>
        </BaseModal>
    );
};
