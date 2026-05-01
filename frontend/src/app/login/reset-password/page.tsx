'use client';

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Lock, CheckCircle, ArrowRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const otp = searchParams.get('otp');

    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            password: Yup.string()
                .min(8, 'Password must be at least 8 characters')
                .required('Required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password')], 'Passwords must match')
                .required('Required'),
        }),
        onSubmit: async (values) => {
            console.log('Resetting password for:', email, 'with OTP:', otp);
            // Simulate API call
            setTimeout(() => {
                router.push('/login?reset=success');
            }, 1500);
        },
    });

    return (
        <AuthLayout
            title="Create New Password"
            subtitle="Step 3 of 3: Secure your account with a new password"
            icon={<Lock className="w-10 h-10" />}
        >
            <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
                {/* New Password */}
                <div className="flex flex-col gap-2">
                    <label className="text-white text-sm font-medium leading-normal">New Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-[#308ce8] transition-colors" />
                        <input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            className={`flex w-full min-w-0 rounded-xl text-white focus:outline-0 focus:ring-2 focus:ring-[#308ce8]/50 border ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-white/10'
                                } bg-white/5 focus:border-[#308ce8] h-14 placeholder:text-slate-500 pl-12 pr-4 text-base font-normal leading-normal transition-all`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                        />
                    </div>
                    {formik.touched.password && formik.errors.password && (
                        <span className="text-red-500 text-xs font-medium">{formik.errors.password}</span>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-2">
                    <label className="text-white text-sm font-medium leading-normal">Confirm New Password</label>
                    <div className="relative group">
                        <CheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-[#308ce8] transition-colors" />
                        <input
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            className={`flex w-full min-w-0 rounded-xl text-white focus:outline-0 focus:ring-2 focus:ring-[#308ce8]/50 border ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : 'border-white/10'
                                } bg-white/5 focus:border-[#308ce8] h-14 placeholder:text-slate-500 pl-12 pr-4 text-base font-normal leading-normal transition-all`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.confirmPassword}
                        />
                    </div>
                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                        <span className="text-red-500 text-xs font-medium">{formik.errors.confirmPassword}</span>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={formik.isSubmitting}
                    className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-[#308ce8] text-white text-lg font-bold leading-normal tracking-[0.015em] shadow-lg shadow-[#308ce8]/25 hover:bg-[#308ce8]/90 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                    <span className="truncate">Reset Password</span>
                    <ArrowRight className="w-5 h-5 ml-2" />
                </button>
            </form>
        </AuthLayout>
    );
}
