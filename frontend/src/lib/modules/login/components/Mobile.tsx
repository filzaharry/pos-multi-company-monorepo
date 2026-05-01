'use client';

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Mail, Lock, LogIn, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LoginPayload } from '../types';

interface MobileProps {
    isLoading: boolean;
    error: string | null;
    requestOTP: (payload: LoginPayload) => Promise<void>;
    verifyOTP: (email: string, otp: string) => Promise<void>;
}

export const Mobile: React.FC<MobileProps> = ({ isLoading, error, requestOTP }) => {
    const router = useRouter();
    const [showPassword, setShowPassword] = React.useState(false);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().required('Password is required'),
        }),
        onSubmit: async (values) => {
            try {
                await requestOTP(values);
                router.push(`/login/verify-otp?email=${encodeURIComponent(values.email)}`);
            } catch (err) {
                console.error('OTP Request error:', err);
            }
        },
    });

    return (
        <AuthLayout
            title="Welcome"
            subtitle="Access your dashboard"
            icon={<LogIn className="w-8 h-8" />}
        >
            <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6 px-2">
                <div className="flex flex-col gap-2">
                    <label className="text-white text-sm font-medium">Email Address</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            name="email"
                            type="email"
                            placeholder="Email address"
                            className={`flex w-full rounded-xl text-white border ${
                                formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-white/10'
                            } bg-white/5 h-14 pl-12 pr-4 transition-all`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                        />
                    </div>
                    {formik.touched.email && formik.errors.email && (
                        <span className="text-red-500 text-xs">{formik.errors.email}</span>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-white text-sm font-medium">Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            className={`flex w-full rounded-xl text-white border ${
                                formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-white/10'
                            } bg-white/5 h-14 pl-12 pr-12 transition-all`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {formik.touched.password && formik.errors.password && (
                        <span className="text-red-500 text-xs">{formik.errors.password}</span>
                    )}
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <p className="text-red-500 text-sm font-medium text-center">{error}</p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={formik.isSubmitting || isLoading}
                    className="flex w-full cursor-pointer items-center justify-center rounded-xl h-14 px-5 bg-primary text-white text-lg font-bold shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
                >
                    <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
                </button>

                <div className="flex justify-center pt-4">
                    <p className="text-slate-400 text-sm">
                        Don&apos;t have an account?{' '}
                        <Link href="/checkout" className="text-primary font-bold">
                            Register
                        </Link>
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
};
