'use client';

import { Accordion } from "@/components/ui/Accordion";
import { PricingCard } from "@/components/ui/landing/PricingCard";
import { TestimonialCard } from "@/components/ui/landing/TestimonialCard";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, { useEffect } from 'react';
import { FAQ, Header, News, Package, Testimonial, TNC } from '../types';

gsap.registerPlugin(ScrollTrigger);

// ── Food/Restaurant Images (Unsplash) ───────────────────────────────────────
const DUMMY_DASHBOARD = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&fit=crop&q=80'; // Fine dining dish
const DUMMY_CHART = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&fit=crop&q=80'; // Restaurant bar/interior
const DUMMY_ORDERS = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=700&fit=crop&q=80'; // Food spread overhead
const DUMMY_EMPLOYEE = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=700&fit=crop&q=80'; // Chef plating food
const DUMMY_TUTORIAL = 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1100&fit=crop&q=80'; // Restaurant table setting
const DUMMY_GLOBE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&fit=crop&q=80'; // Healthy food bowl

interface DesktopProps {
    header: Header | null;
    testimonials: Testimonial[];
    packages: Package[];
    faqs: FAQ[];
    news: News[];
    tnc: TNC | null;
    isLoading: boolean;
}

// ── Reusable: Section Tag ─────────────────────────────────────────────────────
const Tag = ({ children }: { children: React.ReactNode }) => (
    <span className="tag-green">{children}</span>
);

// ── Reusable: Section Heading ─────────────────────────────────────────────────
const SectionHeading = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <h2 className={`text-3xl lg:text-4xl font-bold text-slate-900 leading-tight tracking-tight ${className}`}>
        {children}
    </h2>
);

// ── Reusable: Feature Row Item ────────────────────────────────────────────────
const FeatureRow = ({ icon, title, desc }: { icon: string; title: string; desc: string }) => (
    <div className="feature-row">
        <div
            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(34,197,94,0.12)' }}
        >
            <span className="material-symbols-outlined text-xl" style={{ color: '#16a34a' }}>{icon}</span>
        </div>
        <div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">{title}</h4>
            <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
        </div>
    </div>
);

// ── Reusable: Dashboard Mockup Frame ──────────────────────────────────────────
const MockupFrame = ({ src, alt }: { src: string; alt: string }) => (
    <div className="mockup-wrapper">
        <div className="mockup-topbar">
            <div className="w-3 h-3 rounded-full bg-red-400 opacity-80" />
            <div className="w-3 h-3 rounded-full bg-yellow-400 opacity-80" />
            <div className="w-3 h-3 rounded-full bg-green-400 opacity-80" />
            <div className="flex-1 mx-4 h-5 rounded bg-slate-700 opacity-40" />
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="w-full object-cover" style={{ maxHeight: 340 }} />
    </div>
);

// ── Stat Chip ─────────────────────────────────────────────────────────────────
const StatChip = ({ value, label }: { value: string; label: string }) => (
    <div className="flex flex-col gap-0.5">
        <span className="text-3xl font-bold" style={{ color: '#16a34a' }}>{value}</span>
        <span className="text-xs font-medium text-slate-500      ">{label}</span>
    </div>
);

// ═════════════════════════════════════════════════════════════════════════════
export const Desktop: React.FC<DesktopProps> = ({
    header, testimonials, packages, faqs, isLoading
}) => {
    const heroTitle = header?.title || 'Kelola Penjualan & Analitik Bisnis Anda dalam Satu Tempat';
    const heroSubtitle = header?.subtitle || 'Platform POS terpadu yang dipercaya 50.000+ bisnis modern. Sederhanakan operasional, tingkatkan pendapatan Anda.';
    const heroImage = header?.image || '/assets/banner.png';

    useEffect(() => {
        const ctx = gsap.context(() => {

            // Hero entrance
            gsap.timeline({ delay: 0.2 })
                .fromTo('.h-tag', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' })
                .fromTo('.h-title', { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.2')
                .fromTo('.h-sub', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
                .fromTo('.h-btns', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
                .fromTo('.h-stats', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')
                .fromTo('.h-mockup', { opacity: 0, x: 60, scale: 0.96 }, { opacity: 1, x: 0, scale: 1, duration: 0.9, ease: 'power3.out' }, '-=0.8');

            // Scroll animations — generic helper
            const scrollAnim = (selector: string, from: gsap.TweenVars, stagger = 0) => {
                gsap.fromTo(selector, from,
                    {
                        opacity: 1, y: 0, x: 0, scale: 1,
                        duration: 0.65, ease: 'power2.out',
                        stagger: stagger || undefined,
                        scrollTrigger: { trigger: selector, start: 'top 86%', once: true }
                    }
                );
            };

            scrollAnim('.feat-left', { opacity: 0, x: -40 });
            scrollAnim('.feat-right', { opacity: 0, x: 40 });
            scrollAnim('.stats-left', { opacity: 0, x: -40 });
            scrollAnim('.stats-right', { opacity: 0, x: 40 });
            scrollAnim('.ord-left', { opacity: 0, x: -40 });
            scrollAnim('.ord-right', { opacity: 0, x: 40 });
            scrollAnim('.emp-left', { opacity: 0, x: -40 });
            scrollAnim('.emp-right', { opacity: 0, x: 40 });
            scrollAnim('.tut-section', { opacity: 0, y: 40 });
            scrollAnim('.num-section', { opacity: 0, y: 30 });
            scrollAnim('.test-heading', { opacity: 0, y: 30 });
            scrollAnim('.test-card', { opacity: 0, y: 40, scale: 0.96 }, 0.1);
            scrollAnim('.faq-section', { opacity: 0, y: 30 });
            scrollAnim('.cta-section', { opacity: 0, y: 30 });

        });
        return () => ctx.revert();
    }, []);

    return (
        <div className="w-full bg-white">

            {/* ══════════════════════════════════════════════════════════
                1. HERO
            ══════════════════════════════════════════════════════════ */}
            <section className="relative overflow-hidden pt-20 pb-0" style={{ background: '#ffffff' }}>
                {/* Subtle grid bg */}
                <div className="absolute inset-0 grid-pattern opacity-60 pointer-events-none" />

                {/* Green glow blob top-right */}
                <div
                    className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 65%)', filter: 'blur(40px)' }}
                />

                <div className="max-w-[1280px] mx-auto px-6 lg:px-10 relative z-10">
                    <div className="grid grid-cols-2 gap-16 items-center min-h-[620px]">

                        {/* Left — Text */}
                        <div className="flex flex-col gap-7 pb-16">
                            <div className="h-tag w-fit">
                                <span className="tag-green">🚀 Platform POS Generasi Baru</span>
                            </div>

                            <h1
                                className="h-title text-5xl font-bold text-slate-900 leading-[1.08] tracking-tight"
                                style={{ maxWidth: 520 }}
                            >
                                {heroTitle}
                            </h1>

                            <p className="h-sub text-lg text-slate-500 leading-relaxed" style={{ maxWidth: 460 }}>
                                {heroSubtitle}
                            </p>

                            <div className="h-btns flex items-center gap-4">
                                <button
                                    onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="btn-green px-7 py-3.5 rounded-xl text-sm font-bold cursor-pointer"
                                >
                                    Mulai Gratis
                                </button>
                                <button
                                    onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-base" style={{ color: '#22c55e' }}>play_circle</span>
                                    Pelajari Lebih Lanjut
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="h-stats flex items-center gap-8 pt-2 border-t border-slate-100">
                                <StatChip value="50K+" label="Pengguna Aktif" />
                                <div className="w-px h-10 bg-slate-200" />
                                <StatChip value="99.9%" label="Uptime" />
                                <div className="w-px h-10 bg-slate-200" />
                                <StatChip value="24/7" label="Dukungan" />
                            </div>
                        </div>

                        {/* Right — Dashboard Mockup */}
                        <div className="h-mockup relative flex items-end justify-center pb-0">
                            {/* Floating green card */}
                            <div
                                className="absolute -left-8 top-1/4 rounded-2xl px-5 py-3 shadow-xl z-20"
                                style={{ background: '#fff', border: '1px solid #e2e8f0', minWidth: 160 }}
                            >
                                <div className="text-xs text-slate-500 mb-1">Pendapatan Hari Ini</div>
                                <div className="text-xl font-bold text-slate-900">Rp 4.8M</div>
                                <div className="flex items-center gap-1 mt-1">
                                    <span className="material-symbols-outlined text-xs" style={{ color: '#22c55e', fontVariationSettings: "'FILL' 1" }}>trending_up</span>
                                    <span className="text-xs font-semibold" style={{ color: '#22c55e' }}>+12.4%</span>
                                </div>
                            </div>

                            {/* Main mockup */}
                            <div style={{ width: '100%', maxWidth: 540 }}>
                                <MockupFrame src={heroImage} alt="POS Dashboard" />
                            </div>

                            {/* Small floating orders card */}
                            <div
                                className="absolute -right-4 bottom-28 rounded-2xl px-4 py-3 shadow-xl z-20"
                                style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)', minWidth: 150 }}
                            >
                                <div className="text-xs text-slate-400 mb-1.5">Pesanan Hari Ini</div>
                                <div className="text-lg font-bold text-white">248</div>
                                <div className="mt-2 h-1.5 rounded-full bg-slate-700">
                                    <div className="h-1.5 rounded-full w-3/4" style={{ background: 'linear-gradient(90deg, #22c55e, #16a34a)' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom curve into next section */}
                <div className="w-full h-16 relative overflow-hidden mt-0">
                    <svg viewBox="0 0 1440 64" className="absolute bottom-0 w-full" preserveAspectRatio="none">
                        <path d="M0,64 L1440,64 L1440,20 Q720,-20 0,20 Z" fill="#f8fafc" />
                    </svg>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                2. FEATURES — Unleashing Power Through Features
            ══════════════════════════════════════════════════════════ */}
            <section id="features" className="py-24" style={{ background: '#f8fafc' }}>
                <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
                    <div className="grid grid-cols-2 gap-20 items-start">

                        {/* Left — Heading sticky */}
                        <div className="feat-left flex flex-col gap-6 sticky top-24">
                            <div className="w-full flex justify-start">
                                <Tag>Fitur Unggulan</Tag>
                            </div>
                            <SectionHeading>Optimalkan Bisnis dengan Fitur Lengkap</SectionHeading>
                            <p className="text-slate-500 text-base leading-relaxed max-w-sm">
                                Semua yang Anda butuhkan untuk menjalankan operasional kasir modern — dari manajemen stok hingga pengelolaan staf, semuanya dalam satu dashboard.
                            </p>
                            <button
                                onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
                                className="btn-green w-fit px-6 py-3 rounded-xl text-sm font-bold cursor-pointer mt-2"
                            >
                                Mulai Uji Coba Gratis
                            </button>
                        </div>

                        {/* Right — Feature rows */}
                        <div className="feat-right">
                            <FeatureRow
                                icon="inventory_2"
                                title="Manajemen Stok Cerdas"
                                desc="Pantau stok secara real-time di semua outlet. Dapatkan notifikasi stok menipis dan titik pemesanan ulang otomatis."
                            />
                            <FeatureRow
                                icon="bar_chart"
                                title="Analitik Penjualan Mendalam"
                                desc="Selami aliran pendapatan Anda dengan grafik indah dan laporan yang bisa diekspor kapan saja."
                            />
                            <FeatureRow
                                icon="group"
                                title="Manajemen Banyak Karyawan"
                                desc="Atur hak akses, pantau kinerja, dan kelola jadwal seluruh tim Anda dengan mudah."
                            />
                            <FeatureRow
                                icon="receipt_long"
                                title="Pemrosesan Pesanan Cerdas"
                                desc="Tangani pesanan dine-in, takeaway, dan delivery dari satu antarmuka terpadu."
                            />
                            <FeatureRow
                                icon="payments"
                                title="Berbagai Metode Pembayaran"
                                desc="Terima tunai, kartu, QR code, dan dompet digital — semua terintegrasi dan terrekonsiliasi otomatis."
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                3. MONITOR STATS — Monitor Your Sales Statistics
            ══════════════════════════════════════════════════════════ */}
            <section className="py-24 bg-white">
                <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
                    <div className="grid grid-cols-2 gap-16 items-center">

                        {/* Left */}
                        <div className="stats-left flex flex-col gap-6">
                            <div className="w-full flex justify-start">
                                <Tag>Analitik</Tag>
                            </div>
                            <SectionHeading>Pantau Statistik Penjualan Anda</SectionHeading>
                            <p className="text-slate-500 text-base leading-relaxed">
                                Dapatkan gambaran performa bisnis Anda secara real-time. Identifikasi tren, temukan masalah, dan buat keputusan berbasis data.
                            </p>

                            <div className="grid grid-cols-2 gap-4 mt-2">
                                {[
                                    { icon: 'trending_up', label: 'Pertumbuhan Pendapatan', val: '+24%' },
                                    { icon: 'shopping_cart', label: 'Pesanan Diproses', val: '5M+' },
                                    { icon: 'star', label: 'Rating Pelanggan', val: '4.9★' },
                                    { icon: 'bolt', label: 'Kecepatan Rata-rata', val: '<2d' },
                                ].map(s => (
                                    <div
                                        key={s.label}
                                        className="rounded-2xl p-4"
                                        style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
                                    >
                                        <span className="material-symbols-outlined text-xl" style={{ color: '#22c55e' }}>{s.icon}</span>
                                        <div className="text-xl font-bold text-slate-900 mt-1">{s.val}</div>
                                        <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
                                    </div>
                                ))}
                            </div>

                            <button className="btn-green w-fit px-6 py-3 rounded-xl text-sm font-bold cursor-pointer">
                                Lihat Laporan Lengkap
                            </button>
                        </div>

                        {/* Right — Chart mockup */}
                        <div className="stats-right">
                            <MockupFrame src={DUMMY_CHART} alt="Sales Statistics Chart" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                4. ORDERS — Efficiently Manage Your Orders
            ══════════════════════════════════════════════════════════ */}
            <section className="py-24" style={{ background: '#f8fafc' }}>
                <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
                    <div className="grid grid-cols-2 gap-16 items-center">

                        {/* Left — Image */}
                        <div className="ord-left">
                            <MockupFrame src={DUMMY_ORDERS} alt="Order Management" />
                        </div>

                        {/* Right — Text */}
                        <div className="ord-right flex flex-col gap-6">
                            <div className="w-full flex justify-start">
                                <Tag>Manajemen Pesanan</Tag>
                            </div>
                            <SectionHeading>Kelola Pesanan dengan Efisien</SectionHeading>
                            <p className="text-slate-500 text-base leading-relaxed">
                                Dari penerimaan hingga penyelesaian — sistem pesanan cerdas kami memastikan tidak ada yang terlewat. Tangani ratusan pesanan sekaligus tanpa kewalahan.
                            </p>

                            <div className="flex flex-col gap-3">
                                {[
                                    'Pelacakan pesanan real-time di semua saluran',
                                    'Integrasi otomatis layar dapur (KDS)',
                                    'Perbarui status pesanan dengan satu ketukan',
                                    'Riwayat & preferensi pesanan pelanggan',
                                ].map(f => (
                                    <div key={f} className="flex items-center gap-3">
                                        <div
                                            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                                            style={{ background: 'rgba(34,197,94,0.15)' }}
                                        >
                                            <span className="material-symbols-outlined text-xs" style={{ color: '#16a34a', fontSize: 12 }}>check</span>
                                        </div>
                                        <span className="text-sm text-slate-600">{f}</span>
                                    </div>
                                ))}
                            </div>

                            <button className="btn-green w-fit px-6 py-3 rounded-xl text-sm font-bold cursor-pointer mt-2">
                                Lihat Cara Kerjanya
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                5. EMPLOYEE — Secure and Easy Employee Login
            ══════════════════════════════════════════════════════════ */}
            <section className="py-24 bg-white">
                <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
                    <div className="grid grid-cols-2 gap-16 items-center">

                        {/* Left */}
                        <div className="emp-left flex flex-col gap-6">
                            <div className="w-full flex justify-start">
                                <Tag>Akses Tim</Tag>
                            </div>
                            <SectionHeading>Login Karyawan yang Aman & Mudah</SectionHeading>
                            <p className="text-slate-500 text-base leading-relaxed">
                                Berikan setiap karyawan login aman dengan hak akses berbasis peran. Pantau siapa melakukan apa, kapan, dan dari terminal mana.
                            </p>

                            <div className="grid grid-cols-1 gap-3">
                                {[
                                    { icon: 'fingerprint', title: 'Siap Autentikasi Biometrik', desc: 'Opsi login PIN, tap kartu, atau sidik jari' },
                                    { icon: 'lock', title: 'Izin Berbasis Peran', desc: 'Kontrol akses granular per level staf' },
                                    { icon: 'history', title: 'Jejak Audit Lengkap', desc: 'Setiap tindakan tercatat dengan cap waktu' },
                                ].map(f => (
                                    <div
                                        key={f.title}
                                        className="flex items-start gap-4 p-4 rounded-2xl"
                                        style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
                                    >
                                        <div
                                            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                                            style={{ background: 'rgba(34,197,94,0.1)' }}
                                        >
                                            <span className="material-symbols-outlined text-base" style={{ color: '#16a34a' }}>{f.icon}</span>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-900 text-sm">{f.title}</div>
                                            <div className="text-xs text-slate-500 mt-0.5">{f.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right */}
                        <div className="emp-right">
                            <MockupFrame src={DUMMY_EMPLOYEE} alt="Employee Login" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                6. TUTORIAL — Learn How to Use Our App
            ══════════════════════════════════════════════════════════ */}
            <section className="py-24" style={{ background: '#f8fafc' }}>
                <div className="w-full flex justify-center">
                    <Tag>Tutorial</Tag>
                </div>
                <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
                    <div className="tut-section flex flex-col items-center gap-10">
                        {/* Heading */}
                        <div className="text-center flex flex-col gap-4 max-w-2xl">
                            <SectionHeading>Pelajari Cara Menggunakan Aplikasi Kami</SectionHeading>
                            <p className="text-slate-500 text-base leading-relaxed">
                                Siap beroperasi dalam hitungan menit. Panduan langkah-demi-langkah kami melatih tim Anda dan siap memproses pesanan sejak hari pertama.
                            </p>
                        </div>

                        {/* Large device mockup */}
                        <div className="w-full max-w-[900px]">
                            <div
                                className="rounded-3xl overflow-hidden shadow-2xl"
                                style={{
                                    background: '#1e293b',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    boxShadow: '0 60px 120px rgba(0,0,0,0.15), 0 20px 40px rgba(0,0,0,0.08)'
                                }}
                            >
                                {/* Device top bar */}
                                <div
                                    className="flex items-center justify-between px-6 py-3"
                                    style={{ background: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                                >
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-400 opacity-80" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-400 opacity-80" />
                                        <div className="w-3 h-3 rounded-full bg-green-400 opacity-80" />
                                    </div>
                                    <div className="h-5 w-48 rounded bg-slate-700 opacity-40" />
                                    <div className="flex gap-2">
                                        <div className="w-14 h-5 rounded-lg opacity-50" style={{ background: '#22c55e' }} />
                                    </div>
                                </div>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={DUMMY_TUTORIAL} alt="App Tutorial" className="w-full object-cover" style={{ maxHeight: 480 }} />
                            </div>
                        </div>

                        {/* Steps */}
                        <div className="grid grid-cols-3 gap-8 w-full mt-4">
                            {[
                                { step: '01', title: 'Buat Akun Anda', desc: 'Daftar dan atur profil bisnis Anda dalam kurang dari 2 menit.' },
                                { step: '02', title: 'Konfigurasi Menu', desc: 'Tambah produk, atur harga, dan organisasi kategori dengan mudah.' },
                                { step: '03', title: 'Mulai Berjualan', desc: 'POS Anda siap. Mulai proses pesanan sekarang juga.' },
                            ].map(s => (
                                <div key={s.step} className="flex flex-col gap-3">
                                    <div className="text-4xl font-bold" style={{ color: 'rgba(34,197,94,0.2)', fontFamily: 'monospace' }}>
                                        {s.step}
                                    </div>
                                    <h4 className="font-bold text-slate-900">{s.title}</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                7. NUMBERS BANNER — Let the Numbers Prove It
            ══════════════════════════════════════════════════════════ */}
            <section
                className="py-20 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 60%, #4ade80 100%)' }}
            >
                {/* Dot pattern */}
                <div className="absolute inset-0 dot-pattern opacity-30" />
                {/* Globe illustration */}
                <div className="absolute right-0 top-0 bottom-0 w-[400px] opacity-20 pointer-events-none">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={DUMMY_GLOBE} alt="" className="w-full h-full object-cover" />
                </div>

                <div className="max-w-[1280px] mx-auto px-6 lg:px-10 relative z-10">
                    <div className="num-section grid grid-cols-2 gap-16 items-center">
                        <div className="flex flex-col gap-6">
                            <h2 className="text-4xl font-bold text-white leading-tight">
                                Biarkan Angka<br />Berbicara
                            </h2>
                            <p className="text-white/80 text-base leading-relaxed max-w-md">
                                Bergabunglah bersama puluhan ribu pedagang yang mempercayai platform kami untuk menjalankan operasional harian mereka.
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-8">
                            {[
                                { value: '24/7', label: 'Dukungan Pelanggan' },
                                { value: '5M+', label: 'Pesanan Diproses' },
                                { value: '10+', label: 'Integrasi' },
                            ].map(s => (
                                <div key={s.label} className="flex flex-col gap-2">
                                    <div className="text-4xl font-bold text-white">{s.value}</div>
                                    <div className="text-white/70 text-sm font-medium">{s.label}</div>
                                    <div className="h-1 w-12 rounded-full bg-white/30 mt-1" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                8. PRICING
            ══════════════════════════════════════════════════════════ */}
            <section id="packages" className="py-24 bg-white">
                <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
                    <div className="text-center flex flex-col items-center gap-4 mb-14">
                        <Tag>Harga</Tag>
                        <SectionHeading>Paket Harga Fleksibel untuk Setiap Bisnis</SectionHeading>
                        <p className="text-slate-500 max-w-md text-base">
                            Pilih paket yang sesuai dengan skala bisnis Anda. Upgrade kapan saja seiring pertumbuhan.
                        </p>
                    </div>
                    <div className="grid grid-cols-3 gap-8 items-center">
                        {isLoading ? (
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="h-96 rounded-2xl animate-pulse bg-slate-100" />
                            ))
                        ) : packages.length > 0 ? (
                            packages.map((pkg, index) => (
                                <PricingCard
                                    key={pkg.id}
                                    title={pkg.name}
                                    price={pkg.pricing.toString()}
                                    isPopular={index === 1}
                                    buttonText={index === 2 ? "Hubungi Sales" : (index === 1 ? "Ambil Pro Sekarang" : "Mulai Uji Coba Gratis")}
                                    buttonVariant={index === 2 ? "secondary" : (index === 1 ? "primary" : "outline")}
                                    href="/checkout"
                                    features={pkg.description ? pkg.description.split(',').map((f: string) => f.trim()) : []}
                                    delay={index * 0.1}
                                />
                            ))
                        ) : (
                            /* Kartu demo fallback */
                            [
                                { name: 'Pemula', price: '299', desc: 'Hingga 3 terminal, Analitik dasar, Dukungan email, Laporan bulanan, 5 akun staf' },
                                { name: 'Profesional', price: '699', desc: 'Terminal tak terbatas, Analitik lanjutan, Dukungan prioritas, Laporan real-time, 25 akun staf' },
                                { name: 'Enterprise', price: 'Kustom', desc: 'Semua fitur Pro, Manajer akun khusus, Integrasi kustom, Jaminan SLA, Staf tak terbatas' },
                            ].map((pkg, index) => (
                                <PricingCard
                                    key={pkg.name}
                                    title={pkg.name}
                                    price={pkg.price}
                                    isPopular={index === 1}
                                    buttonText={index === 2 ? "Hubungi Sales" : (index === 1 ? "Ambil Pro Sekarang" : "Mulai Uji Coba Gratis")}
                                    buttonVariant={index === 2 ? "secondary" : (index === 1 ? "primary" : "outline")}
                                    href="/checkout"
                                    features={pkg.desc.split(',').map(f => f.trim())}
                                    delay={index * 0.1}
                                />
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                9. TESTIMONIALS — What They Say
            ══════════════════════════════════════════════════════════ */}
            <section className="py-24" style={{ background: '#f8fafc' }}>
                <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
                    <div className="test-heading text-center flex flex-col items-center gap-4 mb-14">
                        <Tag>Ulasan</Tag>
                        <SectionHeading>Apa Kata Mereka tentang Kami</SectionHeading>
                        <p className="text-slate-500 text-base max-w-md">
                            Ribuan pemilik bisnis mempercayai platform kami setiap harinya.
                        </p>
                    </div>
                    <div className="grid grid-cols-3 gap-7">
                        {isLoading ? (
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="h-52 rounded-2xl animate-pulse bg-slate-200" />
                            ))
                        ) : testimonials.length > 0 ? (
                            testimonials.map((t, index) => (
                                <div key={t.id} className="test-card">
                                    <TestimonialCard
                                        name={t.name}
                                        role={t.role || 'Pemilik Usaha'}
                                        avatar={t.avatar}
                                        content={t.content}
                                        delay={index * 0.1}
                                    />
                                </div>
                            ))
                        ) : (
                            /* Testimoni demo fallback */
                            [
                                { name: 'Budi Santoso', role: 'Pemilik Restoran', content: 'Sistem POS ini mengubah cara kami mengelola pesanan. Pendapatan naik 30% sejak kami beralih.', delay: 0 },
                                { name: 'Dewi Rahayu', role: 'Manajer Kafe', content: 'Fitur analitiknya saja sudah sepadan. Akhirnya saya paham menu mana yang paling menguntungkan.', delay: 0.1 },
                                { name: 'Andi Wijaya', role: 'Direktur F&B', content: 'Mengelola 5 outlet dulu sangat kacau. Sekarang semuanya dalam satu dashboard — luar biasa!', delay: 0.2 },
                            ].map((t, i) => (
                                <div key={i} className="test-card">
                                    <TestimonialCard
                                        name={t.name}
                                        role={t.role}
                                        content={t.content}
                                        delay={t.delay}
                                    />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                10. FAQ
            ══════════════════════════════════════════════════════════ */}
            <section className="py-24 bg-white">
                <div className="max-w-[800px] mx-auto px-6 lg:px-10">
                    <div className="faq-section flex flex-col gap-10">
                        <div className="text-center flex flex-col items-center gap-4">
                            <Tag>FAQ</Tag>
                            <SectionHeading>Pertanyaan yang Sering Diajukan</SectionHeading>
                            <p className="text-slate-500 text-base">
                                Semua yang perlu Anda ketahui sebelum memulai.
                            </p>
                        </div>
                        {isLoading ? (
                            <div className="flex flex-col gap-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="h-14 rounded-xl animate-pulse bg-slate-100" />
                                ))}
                            </div>
                        ) : faqs.length > 0 ? (
                            <Accordion
                                items={faqs.map((faq) => ({
                                    id: faq.id,
                                    title: faq.title,
                                    content: faq.subtitle
                                }))}
                            />
                        ) : (
                            <Accordion items={[
                                { id: 1, title: 'Apakah ada uji coba gratis?', content: 'Ya! Kami menawarkan uji coba gratis 14 hari dengan akses penuh ke semua fitur Profesional. Tanpa kartu kredit.' },
                                { id: 2, title: 'Bisakah POS SaaS digunakan di banyak perangkat?', content: 'Tentu saja. Platform kami berbasis web dan berjalan di tablet, ponsel, dan komputer secara bersamaan.' },
                                { id: 3, title: 'Bagaimana cara penagihan bekerja?', content: 'Tagihan bulanan atau tahunan. Batalkan kapan saja tanpa biaya tersembunyi atau penalti pembatalan.' },
                                { id: 4, title: 'Apakah Anda menyediakan dukungan pelanggan?', content: 'Kami menyediakan dukungan chat dan email 24/7 untuk semua paket. Paket Profesional dan Enterprise juga mendapat dukungan telepon.' },
                            ]} />
                        )}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════
                11. CTA — Ready to Pull the Trigger?
            ══════════════════════════════════════════════════════════ */}
            <section
                id="contact"
                className="py-24 relative overflow-hidden"
                style={{ background: '#f8fafc' }}
            >
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse at center 60%, rgba(34,197,94,0.07) 0%, transparent 60%)' }}
                />
                <div className="max-w-[720px] mx-auto px-6 lg:px-10 relative z-10">
                    <div className="cta-section flex flex-col items-center gap-8 text-center">
                        <Tag>Mulai Sekarang</Tag>
                        <h2 className="text-5xl font-bold text-slate-900 leading-tight tracking-tight">
                            Siap Mengambil<br />Langkah Pertama?
                        </h2>
                        <p className="text-slate-500 text-lg leading-relaxed max-w-md">
                            Bergabunglah dengan lebih dari 50.000 bisnis yang sudah menggunakan POS SaaS untuk menyederhanakan operasional dan meningkatkan pendapatan.
                        </p>

                        {/* Email + CTA */}
                        <div
                            className="flex items-center gap-0 w-full max-w-md rounded-2xl overflow-hidden shadow-lg"
                            style={{ border: '1px solid #e2e8f0' }}
                        >
                            <input
                                type="email"
                                placeholder="Masukkan alamat email Anda"
                                className="flex-1 px-5 py-4 text-sm text-slate-900 outline-none bg-white placeholder-slate-400"
                            />
                            <button className="btn-green px-6 py-4 text-sm font-bold flex-shrink-0 rounded-none">
                                Mulai Gratis
                            </button>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-slate-400">
                            <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-base" style={{ color: '#22c55e' }}>check_circle</span>
                                Uji coba gratis 14 hari
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-base" style={{ color: '#22c55e' }}>check_circle</span>
                                Tanpa kartu kredit
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-base" style={{ color: '#22c55e' }}>check_circle</span>
                                Batalkan kapan saja
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
