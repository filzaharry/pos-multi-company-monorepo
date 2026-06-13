'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle, icon }) => {
    return (
        <div className="relative flex min-h-screen w-full flex-col bg-white text-slate-900 overflow-x-hidden">
            {/* Background visual accents */}
            <div className="fixed top-1/4 -left-20 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-1/4 -right-20 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="layout-container relative z-10 flex h-full grow flex-col">
                {/* Main Content Area */}
                <main className="flex flex-1 items-center justify-center px-4 py-12 lg:py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-[480px] rounded-3xl p-8 lg:p-10 shadow-xl bg-white border border-slate-200"
                    >
                        <div className="flex flex-col items-center mb-8">
                            <div className="bg-primary/10 p-4 rounded-full mb-6 text-primary">
                                {icon}
                            </div>
                            <h1 className="text-slate-900 tracking-tight text-3xl font-bold leading-tight text-center pb-2">
                                {title}
                            </h1>
                            <p className="text-slate-500 text-sm font-normal leading-normal text-center max-w-[320px]">
                                {subtitle}
                            </p>
                        </div>

                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
};
