'use client';

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Email is required'),
        }),
        onSubmit: async (values) => {
            console.log('Reset request for:', values.email);
            // Simulate API call and redirect to OTP screen
            router.push(`/login/verify-otp?email=${encodeURIComponent(values.email)}`);
        },
    });

    return (
        <AuthLayout
            title="Reset Password"
            subtitle="Enter your email to receive a password reset code"
            icon={<Mail className="w-10 h-10" />}
        >
            <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-white text-sm font-medium leading-normal">Email Address</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-[#308ce8] transition-colors" />
                        <input
                            name="email"
                            type="email"
                            placeholder="admin@pos-service.com"
                            className={`flex w-full min-w-0 rounded-xl text-white focus:outline-0 focus:ring-2 focus:ring-[#308ce8]/50 border ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-white/10'
                                } bg-white/5 focus:border-[#308ce8] h-14 placeholder:text-slate-500 pl-12 pr-4 text-base font-normal leading-normal transition-all`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                        />
                    </div>
                    {formik.touched.email && formik.errors.email && (
                        <span className="text-red-500 text-xs font-medium">{formik.errors.email}</span>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={formik.isSubmitting}
                    className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-[#308ce8] text-white text-lg font-bold leading-normal tracking-[0.015em] shadow-lg shadow-[#308ce8]/25 hover:bg-[#308ce8]/90 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                    <span className="truncate">Send Verification Code</span>
                    <Send className="w-5 h-5 ml-2" />
                </button>

                <div className="flex justify-center pt-8 border-t border-white/5 mt-4">
                    <Link href="/login" className="flex items-center gap-2 text-slate-400 hover:text-[#308ce8] text-sm font-medium transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Login
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
