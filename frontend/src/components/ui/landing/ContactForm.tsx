'use client';

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { Loader2, Send } from 'lucide-react';

export const ContactForm = () => {
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            message: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            message: Yup.string().min(10, 'Message must be at least 10 characters').required('Message is required'),
        }),
        onSubmit: async (values, { resetForm }) => {
            // Background simulation
            await new Promise((resolve) => setTimeout(resolve, 2000));
            console.log('Form submitted:', values);
            alert('Message sent successfully!');
            resetForm();
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Name</label>
                    <input
                        {...formik.getFieldProps('name')}
                        className={cn(
                            "w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border transition-all outline-none focus:ring-2 focus:ring-primary/50",
                            formik.touched.name && formik.errors.name ? "border-red-500" : "border-gray-200 dark:border-white/10"
                        )}
                        placeholder="John Doe"
                    />
                    {formik.touched.name && formik.errors.name && (
                        <p className="text-xs text-red-500">{formik.errors.name}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                    <input
                        {...formik.getFieldProps('email')}
                        className={cn(
                            "w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border transition-all outline-none focus:ring-2 focus:ring-primary/50",
                            formik.touched.email && formik.errors.email ? "border-red-500" : "border-gray-200 dark:border-white/10"
                        )}
                        placeholder="john@example.com"
                    />
                    {formik.touched.email && formik.errors.email && (
                        <p className="text-xs text-red-500">{formik.errors.email}</p>
                    )}
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                <textarea
                    {...formik.getFieldProps('message')}
                    rows={4}
                    className={cn(
                        "w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border transition-all outline-none focus:ring-2 focus:ring-primary/50",
                        formik.touched.message && formik.errors.message ? "border-red-500" : "border-gray-200 dark:border-white/10"
                    )}
                    placeholder="How can we help you?"
                />
                {formik.touched.message && formik.errors.message && (
                    <p className="text-xs text-red-500">{formik.errors.message}</p>
                )}
            </div>
            <button
                type="submit"
                disabled={formik.isSubmitting}
                className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
                {formik.isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <>
                        Send Message <Send className="w-4 h-4" />
                    </>
                )}
            </button>
        </form>
    );
};

// Help helper for cn if needed within this file or import it
import { cn } from '@/lib/utils';
