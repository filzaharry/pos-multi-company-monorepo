'use client';

import React, { useState } from 'react';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface VerifyOTPMobileProps {
    email: string;
    type?: string;
    isLoading: boolean;
    error: string | null;
    verifyOTP: (email: string, otp: string) => Promise<void>;
    verifyResetOTP: (email: string, otp: string) => Promise<void>;
}

export const VerifyOTPMobile: React.FC<VerifyOTPMobileProps> = ({
    email,
    type,
    isLoading,
    error,
    verifyOTP,
    verifyResetOTP
}) => {
    const router = useRouter();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);

    const handleChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return false;
        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
        if (element.nextSibling && element.value !== '') {
            (element.nextSibling as HTMLInputElement).focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !otp[index] && e.currentTarget.previousSibling) {
            (e.currentTarget.previousSibling as HTMLInputElement).focus();
        }
    };

    const handleVerify = async () => {
        const code = otp.join('');
        if (code.length < 6) return;
        try {
            if (type === 'forgot') {
                await verifyResetOTP(email, code);
                router.replace(`/login/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(code)}`);
            } else {
                await verifyOTP(email, code);
                router.replace('/dashboard');
            }
        } catch (err) {
            console.error('OTP Verification error:', err);
        }
    };

    return (
        <AuthLayout
            title="Verifikasi"
            subtitle={`Masukkan kode yang dikirim ke ${email}`}
            icon={<ShieldCheck className="w-8 h-8" />}
        >
            <div className="flex flex-col gap-6 px-2">
                <div className="flex justify-between gap-1">
                    {otp.map((data, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength={1}
                            className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl text-center text-xl font-bold text-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                            value={data}
                            onChange={(e) => handleChange(e.target, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                        />
                    ))}
                </div>

                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-red-600 text-sm font-medium text-center">{error}</p>
                    </div>
                )}

                <button
                    onClick={handleVerify}
                    disabled={otp.join('').length < 6 || isLoading}
                    className="flex w-full cursor-pointer items-center justify-center rounded-xl h-14 px-5 btn-green text-white text-lg font-bold shadow-lg disabled:opacity-50"
                >
                    {isLoading ? <RefreshCw className="animate-spin" /> : 'Verifikasi Kode'}
                </button>

                <div className="flex justify-center pt-4">
                    <Link href="/login" className="flex items-center gap-2 text-slate-500 hover:text-primary text-sm font-medium transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Login
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
};
