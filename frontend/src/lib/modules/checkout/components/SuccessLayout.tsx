'use client';

import React from 'react';
import { LandingLayout } from '@/components/layout/LandingLayout';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    CheckCircle2,
    LayoutDashboard,
    ReceiptText,
    CalendarClock,
    Clock
} from 'lucide-react';

export const SuccessLayout = () => {
    return (
        <LandingLayout>
            <main className="flex flex-1 justify-center py-20 relative overflow-hidden bg-white text-slate-900">
                {/* Success Illustration with Background Glow */}
                <div className="layout-content-container flex flex-col max-w-[960px] flex-1 px-4 relative z-10">
                    <div className="flex flex-col items-center justify-center py-8">
                        <div className="relative flex items-center justify-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1.25 }}
                                className="absolute inset-0 bg-primary/10 blur-[60px] rounded-full"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                transition={{ type: "spring", damping: 12 }}
                                className="relative bg-green-50 border border-green-200/80 p-8 rounded-full shadow-[0_8px_40px_rgba(34,197,94,0.15)]"
                            >
                                <CheckCircle2 className="w-[120px] h-[120px] text-primary stroke-[1.5]" />
                            </motion.div>
                        </div>
                    </div>

                    {/* Heading & Subtext */}
                    <div className="text-center mt-8">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-slate-900 tracking-tight text-[32px] md:text-[44px] font-bold leading-tight px-4 pb-3"
                        >
                            Terima Kasih! Pengajuan Langganan Berhasil Dikirim.
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-slate-500 text-base md:text-lg font-normal leading-relaxed pb-8 pt-1 px-4 max-w-2xl mx-auto"
                        >
                            Kami telah mengirimkan email tanda terima ke kotak masuk Anda. Pendaftaran Anda sedang menunggu proses verifikasi dan persetujuan dari admin. Silakan periksa email Anda untuk informasi terbaru selanjutnya.
                        </motion.p>
                    </div>

                    {/* Summary Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-4 flex justify-center"
                    >
                        <div className="w-full max-w-[480px] flex flex-col md:flex-row items-stretch rounded-2xl shadow-lg bg-white border border-slate-200 overflow-hidden group">
                            {/* Product Image Abstract */}
                            <div className="w-full md:w-[160px] relative shrink-0">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark" />
                                <div className="w-full h-full min-h-[140px] flex items-center justify-center p-6 text-white relative z-10">
                                    <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-xl border border-white/30 shadow-xl skew-x-3 rotate-3">
                                        <CheckCircle2 className="w-10 h-10 text-white" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex w-full grow flex-col items-stretch justify-center gap-3 py-5 px-6 bg-white">
                                <div className="flex items-center justify-between">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px]  font-bold bg-yellow-50 text-yellow-700 border border-yellow-200">
                                        <Clock className="w-2.5 h-2.5 text-yellow-600" />
                                        Menunggu Persetujuan Admin
                                    </span>
                                </div>
                                <h3 className="text-slate-900 text-xl font-bold leading-tight tracking-tight">Paket Premium Enterprise</h3>
                                <div className="flex flex-col gap-0.5 mt-1">
                                    <div className="flex items-baseline gap-1.5">
                                        <p className="text-slate-900 text-2xl font-bold">Rp 20.055.000</p>
                                        <p className="text-slate-400 text-xs font-bold">/ tahun</p>
                                    </div>
                                    <p className="text-slate-400 text-xs font-medium leading-normal mt-1.5 flex items-center gap-1.5">
                                        <CalendarClock className="w-3.5 h-3.5 text-primary" />
                                        Status akun: Menunggu verifikasi pembayaran
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 pb-12"
                    >
                        <Link
                            href="/"
                            className="flex min-w-[240px] cursor-pointer items-center justify-center rounded-2xl h-14 px-8 btn-green hover:bg-primary/95 text-white text-lg font-bold transition-all shadow-xl shadow-primary/30 active:scale-[0.98]"
                        >
                            <LayoutDashboard className="w-5 h-5 mr-3" />
                            Kembali ke Beranda
                        </Link>
                    </motion.div>
                </div>

                {/* Background Visual Enhancements */}
                <div className="fixed top-1/4 -left-20 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
                <div className="fixed bottom-1/4 -right-20 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
            </main>
        </LandingLayout>
    );
};
