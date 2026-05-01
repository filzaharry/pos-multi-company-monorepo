'use client';

import React, { useState } from 'react';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface VerifyOTPDesktopProps {
    email: string;
    isLoading: boolean;
    error: string | null;
    verifyOTP: (email: string, otp: string) => Promise<void>;
}

export const VerifyOTPDesktop: React.FC<VerifyOTPDesktopProps> = ({ email, isLoading, error, verifyOTP }) => {
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
            await verifyOTP(email, code);
            router.replace('/dashboard');
        } catch (err) {
            console.error('OTP Verification error:', err);
        }
    };

    return (
        <AuthLayout
            title="Verify Account"
            subtitle={`We've sent a 6-digit code to ${email}`}
            icon={<ShieldCheck className="w-10 h-10" />}
        >
            <div className="flex flex-col gap-8">
                <div className="flex justify-between gap-2">
                    {otp.map((data, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength={1}
                            className="w-full h-14 bg-white/5 border border-white/10 rounded-xl text-center text-2xl font-bold text-white focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                            value={data}
                            onChange={(e) => handleChange(e.target, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onFocus={(e) => e.target.select()}
                        />
                    ))}
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <p className="text-red-500 text-sm font-medium text-center">{error}</p>
                    </div>
                )}

                <button
                    onClick={handleVerify}
                    disabled={otp.join('').length < 6 || isLoading}
                    className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-primary text-white text-lg font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                    {isLoading ? (
                        <RefreshCw className="w-6 h-6 animate-spin" />
                    ) : (
                        <span>Verify Code</span>
                    )}
                </button>

                <div className="text-center">
                    <p className="text-slate-400 text-sm mb-2">Didn&apos;t receive code?</p>
                    <button className="text-primary font-bold text-sm hover:underline transition-all">
                        Resend Code
                    </button>
                </div>

                <div className="flex justify-center pt-8 border-t border-white/5">
                    <Link href="/login" className="flex items-center gap-2 text-slate-400 hover:text-primary text-sm font-medium transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Change Email
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
};
