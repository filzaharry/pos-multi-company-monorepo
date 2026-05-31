'use client';

import React, { useState } from 'react';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface VerifyOTPDesktopProps {
    email: string;
    type?: string;
    isLoading: boolean;
    error: string | null;
    verifyOTP: (email: string, otp: string) => Promise<void>;
    verifyResetOTP: (email: string, otp: string) => Promise<void>;
}

export const VerifyOTPDesktop: React.FC<VerifyOTPDesktopProps> = ({
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
            title="Verifikasi Akun"
            subtitle={`Kami telah mengirimkan 6 digit kode OTP ke ${email}`}
            icon={<ShieldCheck className="w-10 h-10" />}
        >
            <div className="flex flex-col gap-8">
                <div className="flex justify-between gap-2">
                    {otp.map((data, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength={1}
                            className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl text-center text-2xl font-black text-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            value={data}
                            onChange={(e) => handleChange(e.target, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onFocus={(e) => e.target.select()}
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
                    className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 btn-green text-white text-lg font-bold shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
                >
                    {isLoading ? (
                        <RefreshCw className="w-6 h-6 animate-spin" />
                    ) : (
                        <span>Verifikasi Kode</span>
                    )}
                </button>

                <div className="text-center">
                    <p className="text-slate-500 text-sm mb-2">Tidak menerima kode?</p>
                    <button className="text-primary font-bold text-sm hover:underline cursor-pointer transition-all">
                        Kirim Ulang Kode
                    </button>
                </div>

                <div className="flex justify-center pt-8 border-t border-slate-100">
                    <Link href="/login" className="flex items-center gap-2 text-slate-500 hover:text-primary text-sm font-medium transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Ganti Email
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
};
