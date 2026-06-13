import { InputText, InputNumber, InputTextArea } from '@/components/ui/input';
import { BaseModal } from '@/components/ui/modal';
import { useFormik } from 'formik';
import { Loader2, Quote, Star, User } from 'lucide-react';
import { useEffect } from 'react';
import * as Yup from 'yup';
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
                    <InputText
                        label="Author Name"
                        name="name"
                        icon={User}
                        placeholder="e.g. John Doe"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                        error={formik.errors.name}
                        touched={formik.touched.name}
                    />

                    <InputNumber
                        label="Rating (1-5)"
                        name="rating"
                        icon={Star}
                        min="1"
                        max="5"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.rating}
                        error={formik.errors.rating}
                        touched={formik.touched.rating}
                    />

                    <InputTextArea
                        label="Content"
                        name="content"
                        icon={Quote}
                        placeholder="What did they say about us?"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.content}
                        error={formik.errors.content}
                        touched={formik.touched.content}
                    />
                </div>
            </form>
        </BaseModal>
    );
};
