'use client';

import React from 'react';
import Link from 'next/link';

export const LandingFooter = () => {
    return (
        <footer className="bg-white dark:bg-background-dark border-r border-t border-gray-200 dark:border-white/5 py-16">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-3xl">point_of_sale</span>
                            <span className="font-black text-xl text-gray-900 dark:text-white">POS SaaS</span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                            The complete point-of-sale solution for modern businesses looking to grow without complexity.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6 text-gray-900 dark:text-white">Product</h4>
                        <ul className="flex flex-col gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <li><Link className="hover:text-primary transition-colors" href="#">Features</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="#">Pricing</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="#">Integrations</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="#">Updates</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6 text-gray-900 dark:text-white">Company</h4>
                        <ul className="flex flex-col gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <li><Link className="hover:text-primary transition-colors" href="#">About Us</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="#">Careers</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="#">Blog</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="#">Security</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6 text-gray-900 dark:text-white">Connect</h4>
                        <div className="flex gap-4 mb-6">
                            <a className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all text-gray-600 dark:text-gray-400" href="#">
                                <span className="material-symbols-outlined text-lg">public</span>
                            </a>
                            <a className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all text-gray-600 dark:text-gray-400" href="#">
                                <span className="material-symbols-outlined text-lg">alternate_email</span>
                            </a>
                            <a className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all text-gray-600 dark:text-gray-400" href="#">
                                <span className="material-symbols-outlined text-lg">share</span>
                            </a>
                        </div>
                        <p className="text-xs text-gray-400">Subscribe to our newsletter for insights.</p>
                    </div>
                </div>
                <div className="pt-8 border-t border-gray-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">© 2024 POS SaaS Inc. All rights reserved.</p>
                    <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
                        <Link className="hover:text-primary transition-colors" href="#">Privacy Policy</Link>
                        <Link className="hover:text-primary transition-colors" href="#">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
