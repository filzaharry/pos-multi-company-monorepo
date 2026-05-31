'use client';

import React from 'react';
import { LandingNavbar } from '../ui/landing/LandingNavbar';
import { LandingFooter } from '../ui/landing/LandingFooter';

export const LandingLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-white text-slate-900">
            <LandingNavbar />
            <main className="grow">
                {children}
            </main>
            <LandingFooter />
        </div>
    );
};
