'use client';

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Mail, ArrowLeft, Send, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ForgotPasswordDesktopProps {
    isLoading: boolean;
    error: string | null;
    forgotPassword: (email: string) => Promise<void>;
}

export const ForgotPasswordDesktop: React.FC<ForgotPasswordDesktopProps> = ({ isLoading, error, forgotPassword }) => {
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Alamat email tidak valid').required('Email wajib diisi'),
        }),
        onSubmit: async (values) => {
            try {
                await forgotPassword(values.email);
                router.push(`/login/verify-otp?email=${encodeURIComponent(values.email)}&type=forgot`);
            } catch (err) {
                console.error('Forgot password submission error:', err);
            }
        },
    });

    return (
        <AuthLayout
            title="Atur Ulang Kata Sandi"
            subtitle="Masukkan email Anda untuk menerima kode verifikasi"
            icon={<Mail className="w-10 h-10" />}
        >
            <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-slate-700 text-sm font-semibold leading-normal">Alamat Email</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-primary transition-colors" />
                        <input
                            name="email"
                            type="email"
                            placeholder="admin@pos-service.com"
                            className={`flex w-full min-w-0 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 border ${
                                formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-slate-200'
                            } bg-slate-50 focus:bg-white focus:border-primary h-14 placeholder:text-slate-400 pl-12 pr-4 text-base font-normal leading-normal transition-all`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                        />
                    </div>
                    {formik.touched.email && formik.errors.email && (
                        <span className="text-red-500 text-xs font-medium">{formik.errors.email}</span>
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
                    className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 btn-green text-white text-lg font-bold leading-normal tracking-[0.015em] shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
                >
                    {isLoading ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <span className="truncate">Kirim Kode Verifikasi</span>
                            <Send className="w-5 h-5 ml-2" />
                        </>
                    )}
                </button>

                <div className="flex justify-center pt-8 border-t border-slate-100 mt-4">
                    <Link href="/login" className="flex items-center gap-2 text-slate-500 hover:text-primary text-sm font-medium transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Kembali ke Login
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
};
