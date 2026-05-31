'use client';

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Lock, CheckCircle, KeyRound, ArrowRight, RefreshCw, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ResetPasswordDesktopProps {
    email: string;
    otp: string;
    isLoading: boolean;
    error: string | null;
    resetPassword: (email: string, otp: string, newPassword: string) => Promise<void>;
}

export const ResetPasswordDesktop: React.FC<ResetPasswordDesktopProps> = ({
    email,
    otp,
    isLoading,
    error,
    resetPassword
}) => {
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            email: email || '',
            otp: otp || '',
            password: '',
            confirmPassword: '',
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            email: Yup.string().email('Alamat email tidak valid').required('Email wajib diisi'),
            otp: Yup.string().length(6, 'Kode OTP harus 6 digit').required('Wajib diisi'),
            password: Yup.string()
                .min(6, 'Kata sandi minimal harus 6 karakter')
                .required('Wajib diisi'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password')], 'Kata sandi harus cocok')
                .required('Wajib diisi'),
        }),
        onSubmit: async (values) => {
            try {
                await resetPassword(values.email, values.otp, values.password);
                // Redirect to login page on success with query param
                router.push('/login?reset=success');
            } catch (err) {
                console.error('Reset password submission error:', err);
            }
        },
    });

    return (
        <AuthLayout
            title="Atur Ulang Kata Sandi"
            subtitle="Buat kata sandi baru untuk mengamankan akun Anda"
            icon={<Lock className="w-10 h-10" />}
        >
            <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
                {/* New Password */}
                <div className="flex flex-col gap-2">
                    <label className="text-slate-700 text-sm font-semibold leading-normal">Kata Sandi Baru</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
                        <input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            className={`flex w-full min-w-0 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 border ${
                                formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-slate-200'
                            } bg-slate-50 focus:bg-white focus:border-primary h-14 pl-12 pr-4 text-base font-normal leading-normal transition-all`}
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
                    <label className="text-slate-700 text-sm font-semibold leading-normal">Konfirmasi Kata Sandi Baru</label>
                    <div className="relative group">
                        <CheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
                        <input
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            className={`flex w-full min-w-0 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 border ${
                                formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : 'border-slate-200'
                            } bg-slate-50 focus:bg-white focus:border-primary h-14 pl-12 pr-4 text-base font-normal leading-normal transition-all`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.confirmPassword}
                        />
                    </div>
                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                        <span className="text-red-500 text-xs font-medium">{formik.errors.confirmPassword}</span>
                    )}
                </div>

                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-red-600 text-sm font-medium text-center">{error}</p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading || formik.isSubmitting}
                    className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 btn-green text-white text-lg font-bold leading-normal tracking-[0.015em] shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 mt-2"
                >
                    {isLoading ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <span className="truncate">Atur Ulang Kata Sandi</span>
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                    )}
                </button>
            </form>
        </AuthLayout>
    );
};
