'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

import Image from 'next/image';

export const LandingNavbar = () => {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-solid border-gray-200 dark:border-[#293642] bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-20 flex h-16 items-center justify-between whitespace-nowrap">
                <div className="flex items-center gap-3">
                    <div className="text-primary flex items-center justify-center w-10 h-10">
                        <Image src="/assets/logo.png" width={40} height={40} alt="DigiSupreme POS Logo" className="object-contain" />
                    </div>
                    <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-gray-900 dark:text-white">POS SaaS</h2>
                </div>
                <div className="flex flex-1 justify-end gap-8">
                    <nav className="hidden md:flex items-center gap-9">
                        <Link className="text-sm font-medium hover:text-primary transition-colors text-gray-900 dark:text-white" href="/">Home</Link>
                        <Link className="text-sm font-medium hover:text-primary transition-colors text-gray-900 dark:text-white" href="#packages">Packages</Link>
                        <Link className="text-sm font-medium hover:text-primary transition-colors text-gray-900 dark:text-white" href="#about">About</Link>
                        <Link className="text-sm font-medium hover:text-primary transition-colors text-gray-900 dark:text-white" href="#contact">Contact</Link>
                    </nav>
                    <Link
                        href="/login"
                        className="flex min-w-[120px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold transition-all hover:bg-primary/90 active:scale-95 shadow-lg shadow-primary/20"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </header>
    );
};
