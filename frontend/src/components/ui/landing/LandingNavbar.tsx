'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';

export const LandingNavbar = () => {
    const navRef = useRef<HTMLElement>(null);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        gsap.fromTo(navRef.current,
            { y: -60, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.1 }
        );
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header
            ref={navRef}
            className="sticky top-0 z-50 w-full transition-all duration-300"
            style={{
                background: scrolled ? 'rgba(255,255,255,0.95)' : '#ffffff',
                backdropFilter: scrolled ? 'blur(16px)' : 'none',
                borderBottom: scrolled ? '1px solid #e2e8f0' : '1px solid #f1f5f9',
                boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.06)' : 'none',
            }}
        >
            <div className="max-w-[1280px] mx-auto px-6 lg:px-10 flex h-16 items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5">
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
                    >
                        <Image src="/assets/logo.png" width={20} height={20} alt="Logo" className="object-contain" />
                    </div>
                    <span className="text-base font-bold text-slate-900 tracking-tight">POS SaaS</span>
                </Link>

                {/* Nav */}
                <nav className="hidden md:flex items-center gap-7">
                    {[
                        { label: 'Fitur', href: '#features' },
                        { label: 'Harga', href: '#packages' },
                        { label: 'Tentang Kami', href: '#about' },
                        { label: 'Kontak', href: '#contact' },
                    ].map(item => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/login"
                        className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-4 py-2"
                    >
                        Masuk
                    </Link>
                    <Link
                        href="/login"
                        className="btn-green text-sm font-semibold px-5 py-2.5 rounded-lg"
                    >
                        Mulai Gratis
                    </Link>
                </div>
            </div>
        </header>
    );
};
