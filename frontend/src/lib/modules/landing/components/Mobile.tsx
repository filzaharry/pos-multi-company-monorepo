'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PricingCard } from "@/components/ui/landing/PricingCard";
import { TestimonialCard } from "@/components/ui/landing/TestimonialCard";
import { Accordion } from "@/components/ui/Accordion";
import { Testimonial, Package, FAQ, News, TNC, Header } from '../types';

gsap.registerPlugin(ScrollTrigger);

// ── Food/Restaurant Images (Unsplash) ───────────────────────────────────────
const DUMMY_DASHBOARD = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&fit=crop&q=80'; // Fine dining dish
const DUMMY_CHART = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&fit=crop&q=80'; // Restaurant bar/interior
const DUMMY_ORDERS = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=700&fit=crop&q=80'; // Food spread overhead
const DUMMY_TUTORIAL = 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&fit=crop&q=80'; // Restaurant table setting


interface MobileProps {
    header: Header | null;
    testimonials: Testimonial[];
    packages: Package[];
    faqs: FAQ[];
    news: News[];
    tnc: TNC | null;
    isLoading: boolean;
}

const Tag = ({ children }: { children: React.ReactNode }) => (
    <span className="tag-green">{children}</span>
);

const MockupFrame = ({ src, alt }: { src: string; alt: string }) => (
    <div className="rounded-2xl overflow-hidden shadow-xl" style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center px-3 py-2 gap-1.5" style={{ background: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="w-2.5 h-2.5 rounded-full bg-red-400 opacity-80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 opacity-80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400 opacity-80" />
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="w-full object-cover" />
    </div>
);

export const Mobile: React.FC<MobileProps> = ({
    header, testimonials, packages, faqs, isLoading
}) => {
    const heroTitle = header?.title || 'Kelola Penjualan & Analitik Bisnis Anda dalam Satu Tempat';
    const heroSubtitle = header?.subtitle || 'Platform POS terpadu yang dipercaya 50.000+ bisnis modern.';
    const heroImage = header?.image || '/assets/banner.png';

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.timeline({ delay: 0.2 })
                .fromTo('.m-tag', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)' })
                .fromTo('.m-title', { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.2')
                .fromTo('.m-sub', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
                .fromTo('.m-ctas', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, '-=0.2')
                .fromTo('.m-img', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.2');

            ['.m-sec-feat', '.m-sec-stats', '.m-sec-orders', '.m-sec-tut',
                '.m-sec-nums', '.m-sec-price', '.m-sec-test', '.m-sec-faq', '.m-sec-cta'
            ].forEach(sel => {
                gsap.fromTo(sel, { opacity: 0, y: 30 }, {
                    opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
                    scrollTrigger: { trigger: sel, start: 'top 90%', once: true }
                });
            });
        });
        return () => ctx.revert();
    }, []);

    return (
        <div className="w-full bg-white">

            {/* ── HERO ─── */}
            <section className="relative overflow-hidden pt-12 pb-0" style={{ background: '#ffffff' }}>
                <div className="absolute inset-0 grid-pattern opacity-50 pointer-events-none" />
                <div
                    className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 65%)', filter: 'blur(30px)' }}
                />
                <div className="max-w-[1280px] mx-auto px-5 relative z-10">
                    <div className="flex flex-col gap-6 text-center items-center pb-10">
                        <div className="m-tag"><Tag>🚀 Platform POS Generasi Baru</Tag></div>
                        <h1 className="m-title text-4xl font-bold text-slate-900 leading-tight tracking-tight max-w-sm">
                            {heroTitle}
                        </h1>
                        <p className="m-sub text-base text-slate-500 leading-relaxed max-w-xs">
                            {heroSubtitle}
                        </p>
                        <div className="m-ctas flex flex-col gap-3 w-full max-w-[280px]">
                            <button
                                onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
                                className="btn-green w-full py-3.5 rounded-xl text-sm font-bold cursor-pointer"
                            >
                                Mulai Gratis
                            </button>
                            <button
                                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                                className="w-full py-3 rounded-xl text-sm font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all"
                            >
                                Pelajari Lebih Lanjut
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-6 pt-2 border-t border-slate-100 w-full justify-center">
                            {[
                                { value: '50K+', label: 'Pengguna' },
                                { value: '99.9%', label: 'Uptime' },
                                { value: '24/7', label: 'Dukungan' },
                            ].map(s => (
                                <div key={s.label} className="flex flex-col items-center gap-0.5">
                                    <span className="text-xl font-bold" style={{ color: '#16a34a' }}>{s.value}</span>
                                    <span className="text-[10px] text-slate-400      ">{s.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="m-img px-2">
                        <MockupFrame src={heroImage} alt="Dashboard" />
                    </div>
                </div>
                <div className="w-full h-10 relative overflow-hidden">
                    <svg viewBox="0 0 768 40" className="absolute bottom-0 w-full" preserveAspectRatio="none">
                        <path d="M0,40 L768,40 L768,12 Q384,-8 0,12 Z" fill="#f8fafc" />
                    </svg>
                </div>
            </section>

            {/* ── FEATURES ─── */}
            <section id="features" className="py-16" style={{ background: '#f8fafc' }}>
                <div className="max-w-[1280px] mx-auto px-5">
                    <div className="m-sec-feat flex flex-col gap-8">
                        <div className="flex flex-col gap-3">
                            <Tag>Fitur Unggulan</Tag>
                            <h2 className="text-2xl font-bold text-slate-900 leading-tight">Optimalkan Bisnis dengan Fitur Lengkap</h2>
                            <p className="text-slate-500 text-sm leading-relaxed">Semua yang Anda butuhkan untuk operasional kasir modern.</p>
                        </div>
                        <div className="flex flex-col">
                            {[
                                { icon: 'inventory_2', title: 'Manajemen Stok Cerdas', desc: 'Pelacakan stok real-time di semua outlet.' },
                                { icon: 'bar_chart', title: 'Analitik Penjualan', desc: 'Grafik indah dan laporan yang bisa diekspor.' },
                                { icon: 'group', title: 'Manajemen Staf', desc: 'Hak akses, jadwal, dan pemantauan kinerja.' },
                                { icon: 'receipt_long', title: 'Pemrosesan Pesanan', desc: 'Antarmuka terpadu untuk semua jenis pesanan.' },
                                { icon: 'payments', title: 'Berbagai Pembayaran', desc: 'Tunai, kartu, QR code, dan dompet digital.' },
                            ].map(f => (
                                <div
                                    key={f.title}
                                    className="flex items-start gap-4 py-4"
                                    style={{ borderBottom: '1px solid #e2e8f0' }}
                                >
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                        style={{ background: 'rgba(34,197,94,0.1)' }}
                                    >
                                        <span className="material-symbols-outlined text-xl" style={{ color: '#16a34a' }}>{f.icon}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm">{f.title}</h4>
                                        <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{f.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── STATS ─── */}
            <section className="py-16 bg-white">
                <div className="max-w-[1280px] mx-auto px-5">
                    <div className="m-sec-stats flex flex-col gap-7">
                        <div className="flex flex-col gap-3">
                            <Tag>Analitik</Tag>
                            <h2 className="text-2xl font-bold text-slate-900 leading-tight">Pantau Statistik Penjualan Anda</h2>
                        </div>
                        <MockupFrame src={DUMMY_CHART} alt="Sales Chart" />
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { icon: 'trending_up', label: 'Pertumbuhan Pendapatan', val: '+24%' },
                                { icon: 'shopping_cart', label: 'Pesanan', val: '5M+' },
                                { icon: 'star', label: 'Rating', val: '4.9★' },
                                { icon: 'bolt', label: 'Kecepatan', val: '<2d' },
                            ].map(s => (
                                <div
                                    key={s.label}
                                    className="rounded-xl p-4"
                                    style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
                                >
                                    <span className="material-symbols-outlined text-xl" style={{ color: '#22c55e' }}>{s.icon}</span>
                                    <div className="text-xl font-bold text-slate-900 mt-1">{s.val}</div>
                                    <div className="text-xs text-slate-500">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── ORDERS ─── */}
            <section className="py-16" style={{ background: '#f8fafc' }}>
                <div className="max-w-[1280px] mx-auto px-5">
                    <div className="m-sec-orders flex flex-col gap-7">
                        <div className="flex flex-col gap-3">
                            <Tag>Manajemen Pesanan</Tag>
                            <h2 className="text-2xl font-bold text-slate-900 leading-tight">Kelola Pesanan dengan Efisien</h2>
                            <p className="text-slate-500 text-sm leading-relaxed">Tangani ratusan pesanan sekaligus tanpa kewalahan.</p>
                        </div>
                        <MockupFrame src={DUMMY_ORDERS} alt="Orders" />
                        <button className="btn-green w-fit px-6 py-3 rounded-xl text-sm font-bold cursor-pointer">
                            Lihat Cara Kerjanya
                        </button>
                    </div>
                </div>
            </section>

            {/* ── TUTORIAL ─── */}
            <section className="py-16 bg-white">
                <div className="max-w-[1280px] mx-auto px-5">
                    <div className="m-sec-tut flex flex-col gap-7 items-center text-center">
                        <Tag>Tutorial</Tag>
                        <h2 className="text-2xl font-bold text-slate-900 leading-tight">Pelajari Cara Menggunakan Aplikasi Kami</h2>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                            Siap beroperasi dalam hitungan menit dengan panduan onboarding kami.
                        </p>
                        <div className="w-full">
                            <div
                                className="rounded-2xl overflow-hidden shadow-xl"
                                style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)' }}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={DUMMY_TUTORIAL} alt="Tutorial" className="w-full object-cover" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── NUMBERS BANNER ─── */}
            <section
                className="py-16 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 60%, #4ade80 100%)' }}
            >
                <div className="absolute inset-0 dot-pattern opacity-20" />
                <div className="max-w-[1280px] mx-auto px-5 relative z-10">
                    <div className="m-sec-nums flex flex-col gap-8">
                        <div>
                            <h2 className="text-3xl font-bold text-white leading-tight">Biarkan Angka Berbicara</h2>
                            <p className="text-white/75 text-sm mt-2 leading-relaxed">
                                Dipercaya puluhan ribu bisnis di seluruh dunia.
                            </p>
                        </div>
                        <div className="grid grid-cols-3 gap-6">
                            {[
                                { value: '24/7', label: 'Dukungan' },
                                { value: '5M+', label: 'Pesanan' },
                                { value: '10+', label: 'Integrasi' },
                            ].map(s => (
                                <div key={s.label} className="flex flex-col gap-1">
                                    <div className="text-3xl font-bold text-white">{s.value}</div>
                                    <div className="text-white/65 text-xs font-medium">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── PRICING ─── */}
            <section id="packages" className="py-16 bg-white">
                <div className="max-w-[1280px] mx-auto px-5">
                    <div className="m-sec-price flex flex-col gap-8">
                        <div className="text-center flex flex-col items-center gap-3">
                            <Tag>Harga</Tag>
                            <h2 className="text-2xl font-bold text-slate-900 leading-tight">Paket Harga Fleksibel</h2>
                        </div>
                        <div className="flex flex-col gap-5">
                            {isLoading ? (
                                [...Array(3)].map((_, i) => (
                                    <div key={i} className="h-64 rounded-2xl animate-pulse bg-slate-100" />
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
                                    />
                                ))
                            ) : (
                                [
                                    { name: 'Pemula', price: '299', desc: 'Hingga 3 terminal, Analitik dasar, Dukungan email' },
                                    { name: 'Profesional', price: '699', desc: 'Terminal tak terbatas, Analitik lanjutan, Dukungan prioritas' },
                                    { name: 'Enterprise', price: 'Kustom', desc: 'Semua fitur Pro, Manajer akun khusus, Integrasi kustom' },
                                ].map((pkg, index) => (
                                    <PricingCard
                                        key={pkg.name}
                                        title={pkg.name}
                                        price={pkg.price}
                                        isPopular={index === 1}
                                        buttonText={index === 2 ? "Hubungi Sales" : (index === 1 ? "Ambil Pro Sekarang" : "Mulai Gratis")}
                                        buttonVariant={index === 2 ? "secondary" : (index === 1 ? "primary" : "outline")}
                                        href="/checkout"
                                        features={pkg.desc.split(',').map(f => f.trim())}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIALS ─── */}
            <section className="py-16" style={{ background: '#f8fafc' }}>
                <div className="max-w-[1280px] mx-auto px-5">
                    <div className="m-sec-test flex flex-col gap-8">
                        <div className="text-center flex flex-col items-center gap-3">
                            <Tag>Ulasan</Tag>
                            <h2 className="text-2xl font-bold text-slate-900 leading-tight">Apa Kata Mereka tentang Kami</h2>
                        </div>
                        <div className="flex flex-col gap-5">
                            {isLoading ? (
                                [...Array(2)].map((_, i) => (
                                    <div key={i} className="h-44 rounded-2xl animate-pulse bg-slate-200" />
                                ))
                            ) : testimonials.length > 0 ? (
                                testimonials.slice(0, 3).map((t, index) => (
                                    <TestimonialCard
                                        key={t.id}
                                        name={t.name}
                                        role={t.role || 'Pemilik Usaha'}
                                        avatar={t.avatar}
                                        content={t.content}
                                        delay={index * 0.08}
                                    />
                                ))
                            ) : (
                                [
                                    { name: 'Budi Santoso', role: 'Pemilik Restoran', content: 'Pendapatan naik 30% sejak kami beralih. POS ini benar-benar mengubah cara kerja kami!' },
                                    { name: 'Dewi Rahayu', role: 'Manajer Kafe', content: 'Fitur analitiknya sangat membantu. Akhirnya tahu menu mana yang paling menguntungkan.' },
                                ].map((t, i) => (
                                    <TestimonialCard key={i} name={t.name} role={t.role} content={t.content} delay={i * 0.08} />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FAQ ─── */}
            <section className="py-16 bg-white">
                <div className="max-w-[1280px] mx-auto px-5">
                    <div className="m-sec-faq flex flex-col gap-8">
                        <div className="text-center flex flex-col items-center gap-3">
                            <Tag>FAQ</Tag>
                            <h2 className="text-2xl font-bold text-slate-900 leading-tight">Pertanyaan yang Sering Diajukan</h2>
                        </div>
                        {isLoading ? (
                            <div className="flex flex-col gap-3">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="h-14 rounded-xl animate-pulse bg-slate-100" />
                                ))}
                            </div>
                        ) : faqs.length > 0 ? (
                            <Accordion items={faqs.map(faq => ({ id: faq.id, title: faq.title, content: faq.subtitle }))} />
                        ) : (
                            <Accordion items={[
                                { id: 1, title: 'Apakah ada uji coba gratis?', content: 'Ya! Uji coba gratis 14 hari dengan akses Profesional penuh. Tanpa kartu kredit.' },
                                { id: 2, title: 'Bisakah digunakan di banyak perangkat?', content: 'Tentu saja. Berjalan di tablet, ponsel, dan komputer secara bersamaan.' },
                                { id: 3, title: 'Bagaimana cara penagihan?', content: 'Tagihan bulanan atau tahunan. Batalkan kapan saja tanpa penalti.' },
                            ]} />
                        )}
                    </div>
                </div>
            </section>

            {/* ── CTA ─── */}
            <section
                id="contact"
                className="py-16 relative overflow-hidden"
                style={{ background: '#f8fafc' }}
            >
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse at center, rgba(34,197,94,0.07) 0%, transparent 60%)' }}
                />
                <div className="max-w-[1280px] mx-auto px-5 relative z-10">
                    <div className="m-sec-cta flex flex-col items-center gap-6 text-center">
                        <Tag>Mulai Sekarang</Tag>
                        <h2 className="text-3xl font-bold text-slate-900 leading-tight">Siap Mengambil Langkah Pertama?</h2>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                            Bergabunglah dengan 50.000+ bisnis yang sudah menggunakan POS SaaS.
                        </p>
                        <div
                            className="flex flex-col w-full max-w-xs gap-3 rounded-2xl overflow-hidden"
                        >
                            <input
                                type="email"
                                placeholder="Masukkan alamat email Anda"
                                className="px-4 py-3.5 text-sm text-slate-900 outline-none bg-white border border-slate-200 rounded-xl placeholder-slate-400"
                            />
                            <button className="btn-green w-full py-3.5 rounded-xl text-sm font-bold cursor-pointer">
                                Mulai Gratis
                            </button>
                        </div>
                        <div className="flex flex-col gap-2 text-xs text-slate-400">
                            <span>✓ Uji coba gratis 14 hari &nbsp;·&nbsp; ✓ Tanpa kartu kredit &nbsp;·&nbsp; ✓ Batalkan kapan saja</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
