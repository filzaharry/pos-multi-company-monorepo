'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle, icon }) => {
    return (
        <div className="relative flex min-h-screen w-full flex-col bg-[#111921] text-white overflow-x-hidden">
            {/* Background radial gradient */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,#1a2632,#111921)] pointer-events-none" />

            {/* Background visual accents */}
            <div className="fixed top-1/4 -left-20 w-[500px] h-[500px] bg-[#308ce8]/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-1/4 -right-20 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="layout-container relative z-10 flex h-full grow flex-col">

                {/* Main Content Area */}
                <main className="flex flex-1 items-center justify-center px-4 py-12 lg:py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-[480px] rounded-2xl p-8 lg:p-10 shadow-2xl bg-[#1a2632]/70 backdrop-blur-xl border border-white/10"
                    >
                        <div className="flex flex-col items-center mb-8">
                            <div className="bg-[#308ce8]/20 p-4 rounded-full mb-6 text-[#308ce8]">
                                {icon}
                            </div>
                            <h1 className="text-white tracking-tight text-3xl font-bold leading-tight text-center pb-2">
                                {title}
                            </h1>
                            <p className="text-slate-400 text-base font-normal leading-normal text-center max-w-[320px]">
                                {subtitle}
                            </p>
                        </div>

                        {children}
                    </motion.div>
                </main>

                {/* Footer */}
                {/* <footer className="px-6 lg:px-10 py-6 text-center">
                    <p className="text-slate-500 text-xs">
                        © 2024 POS Subscription Service Admin Dashboard. Secure Infrastructure.
                    </p>
                </footer> */}
            </div>
        </div>
    );
};
