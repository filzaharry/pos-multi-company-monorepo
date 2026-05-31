'use client';

import React from 'react';
import Link from 'next/link';

export const LandingFooter = () => {
    return (
        <footer
            className="py-16"
            style={{ background: '#0f172a', borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
            <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
                <div className="grid grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="flex flex-col gap-4 col-span-1">
                        <div className="flex items-center gap-2.5">
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
                            >
                                <span className="material-symbols-outlined text-white text-base">point_of_sale</span>
                            </div>
                            <span className="font-black text-lg text-white">POS SaaS</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Solusi POS lengkap untuk bisnis modern. Kelola semuanya dalam satu tempat.
                        </p>
                        <div className="flex gap-3 mt-2">
                            {['public', 'alternate_email', 'share'].map(icon => (
                                <a
                                    key={icon}
                                    href="#"
                                    className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200"
                                    style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(34,197,94,0.2)')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                                >
                                    <span className="material-symbols-outlined text-base">{icon}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {[
                        {
                            title: 'Produk',
                            links: ['Fitur', 'Harga', 'Integrasi', 'Pembaruan', 'Changelog'],
                        },
                        {
                            title: 'Perusahaan',
                            links: ['Tentang Kami', 'Karir', 'Blog', 'Pers', 'Keamanan'],
                        },
                        {
                            title: 'Dukungan',
                            links: ['Dokumentasi', 'Pusat Bantuan', 'API Docs', 'Status', 'Kontak'],
                        },
                    ].map(col => (
                        <div key={col.title}>
                            <h4 className="text-white font-bold text-sm mb-5 uppercase tracking-widest">{col.title}</h4>
                            <ul className="flex flex-col gap-3">
                                {col.links.map(link => (
                                    <li key={link}>
                                        <Link
                                            href="#"
                                            className="text-slate-400 text-sm hover:text-white transition-colors"
                                        >
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom */}
                <div
                    className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
                >
                    <p className="text-slate-500 text-sm">© 2024 POS SaaS Inc. Seluruh hak cipta dilindungi.</p>
                    <div className="flex gap-6 text-sm text-slate-500">
                        <Link className="hover:text-white transition-colors" href="#">Kebijakan Privasi</Link>
                        <Link className="hover:text-white transition-colors" href="#">Syarat & Ketentuan</Link>
                        <Link className="hover:text-white transition-colors" href="#">Kebijakan Cookie</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
