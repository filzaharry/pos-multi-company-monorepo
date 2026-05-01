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

export default function CheckoutSuccessPage() {
    return (
        <LandingLayout>
            <main className="flex flex-1 justify-center py-20 relative overflow-hidden">
                {/* Success Illustration with Background Glow */}
                <div className="layout-content-container flex flex-col max-w-[960px] flex-1 px-4 relative z-10">
                    <div className="flex flex-col items-center justify-center py-8">
                        <div className="relative flex items-center justify-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1.25 }}
                                className="absolute inset-0 bg-green-500/20 blur-[60px] rounded-full"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                transition={{ type: "spring", damping: 12 }}
                                className="relative bg-green-500/10 border border-green-500/30 p-8 rounded-full shadow-[0_0_40px_rgba(34,197,94,0.3)]"
                            >
                                <CheckCircle2 className="w-[120px] h-[120px] text-green-400 stroke-[1.5]" />
                            </motion.div>
                        </div>
                    </div>

                    {/* Heading & Subtext */}
                    <div className="text-center mt-8">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-white tracking-tight text-[40px] md:text-[52px] font-black leading-tight px-4 pb-3"
                        >
                            Thank you! Your subscription is active.
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-white/60 text-lg md:text-xl font-normal leading-relaxed pb-8 pt-1 px-4 max-w-2xl mx-auto"
                        >
                            We've sent a confirmation email to your inbox. Your account is being prepared and your premium features are now unlocked.
                        </motion.p>
                    </div>

                    {/* Glass-morphism Summary Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-4 flex justify-center"
                    >
                        <div className="w-full max-w-[640px] flex flex-col md:flex-row items-stretch rounded-3xl shadow-2xl bg-white/5 backdrop-blur-3xl border border-white/10 overflow-hidden group">
                            {/* Product Image Abstract */}
                            <div className="w-full md:w-[240px] relative">
                                <div className="absolute inset-0 bg-linear-to-br from-primary to-blue-600 opacity-60 group-hover:opacity-70 transition-opacity" />
                                <div className="w-full h-full min-h-[200px] flex items-center justify-center p-8 text-white relative z-10">
                                    <div className="p-6 bg-white/20 rounded-3xl backdrop-blur-xl border border-white/30 shadow-2xl skew-x-3 rotate-3">
                                        <CheckCircle2 className="w-16 h-16" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex w-full grow flex-col items-stretch justify-center gap-4 py-8 px-8">
                                <div className="flex items-center justify-between">
                                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-yellow-500/20 text-yellow-500 border border-yellow-500/30">
                                        <Clock className="w-3 h-3" />
                                        Pending verification
                                    </span>
                                </div>
                                <h3 className="text-white text-3xl font-bold leading-tight tracking-tight">POS Pro Premium</h3>
                                <div className="flex flex-col gap-1 mt-2">
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-white text-4xl font-black">$299.00</p>
                                        <p className="text-white/40 text-base font-bold">/ year</p>
                                    </div>
                                    <p className="text-white/30 text-sm font-medium leading-normal mt-2 flex items-center gap-2">
                                        <CalendarClock className="w-4 h-4" />
                                        Next billing date: Oct 24, 2025
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
                            className="flex min-w-[240px] cursor-pointer items-center justify-center rounded-2xl h-14 px-8 bg-primary hover:bg-primary/90 text-white text-lg font-black transition-all shadow-xl shadow-primary/30 active:scale-[0.98]"
                        >
                            <LayoutDashboard className="w-5 h-5 mr-3" />
                            Go to Home
                        </Link>
                        <button className="flex min-w-[240px] cursor-pointer items-center justify-center rounded-2xl h-14 px-8 border-2 border-white/10 text-white/70 hover:text-white hover:bg-white/5 text-lg font-bold transition-all active:scale-[0.98]">
                            <ReceiptText className="w-5 h-5 mr-3" />
                            View Receipt
                        </button>
                    </motion.div>
                </div>

                {/* Background Visual Enhancements */}
                <div className="fixed top-1/4 -left-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />
                <div className="fixed bottom-1/4 -right-20 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none -z-10" />
            </main>
        </LandingLayout>
    );
}
