'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface PricingCardProps {
    title: string;
    price: string;
    features: string[];
    isPopular?: boolean;
    buttonText: string;
    buttonVariant?: 'primary' | 'outline' | 'secondary';
    delay?: number;
    href?: string;
}

export const PricingCard: React.FC<PricingCardProps> = ({
    title, price, features, isPopular, buttonText, buttonVariant = 'outline', delay = 0, href = '/checkout'
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay }}
            viewport={{ once: true }}
            className={cn(
                "relative flex flex-col gap-7 rounded-2xl p-7 transition-all duration-300",
                isPopular ? "scale-105 z-10" : "hover:-translate-y-1"
            )}
            style={isPopular ? {
                background: '#0f172a',
                border: '2px solid #22c55e',
                boxShadow: '0 20px 60px rgba(34,197,94,0.2), 0 8px 24px rgba(0,0,0,0.15)',
            } : {
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 20px rgba(0,0,0,0.04)',
            }}
        >
            {isPopular && (
                <div
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-white text-[10px] font-bold  px-4 py-1.5 rounded-full"
                    style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
                >
                    Most Popular
                </div>
            )}

            {/* Plan name */}
            <div>
                <h3
                    className="text-xs font-bold  mb-2"
                    style={{ color: isPopular ? '#4ade80' : '#22c55e' }}
                >
                    {title}
                </h3>
                <div className="flex items-baseline gap-1">
                    {price !== 'Custom' && <span className={`text-sm font-medium ${isPopular ? 'text-slate-400' : 'text-slate-500'}`}>Rp</span>}
                    <span className={`text-4xl font-bold ${isPopular ? 'text-white' : 'text-slate-900'}`}>
                        {price}
                    </span>
                    {price !== 'Custom' && (
                        <span className={`text-sm font-medium ${isPopular ? 'text-slate-400' : 'text-slate-400'}`}>/mo</span>
                    )}
                </div>
            </div>

            {/* CTA Button */}
            <Link href={href}>
                <button
                    className={cn(
                        "w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95",
                        buttonVariant === 'primary' && "btn-green",
                        buttonVariant === 'outline' && "border-2 text-slate-700 hover:bg-slate-50",
                        buttonVariant === 'secondary' && "hover:bg-white/5"
                    )}
                    style={
                        buttonVariant === 'outline'
                            ? { borderColor: '#22c55e', color: '#16a34a' }
                            : buttonVariant === 'secondary'
                                ? { border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', background: 'transparent' }
                                : undefined
                    }
                >
                    {buttonText}
                </button>
            </Link>

            {/* Divider */}
            <div
                className="h-px w-full"
                style={{ background: isPopular ? 'rgba(255,255,255,0.08)' : '#f1f5f9' }}
            />

            {/* Features */}
            <ul className="flex flex-col gap-3">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                        <div
                            className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                            style={{
                                background: isPopular ? 'rgba(34,197,94,0.2)' : 'rgba(34,197,94,0.1)',
                            }}
                        >
                            <span
                                className="material-symbols-outlined"
                                style={{ color: '#22c55e', fontSize: 12, fontVariationSettings: "'wght' 700" }}
                            >
                                check
                            </span>
                        </div>
                        <span style={{ color: isPopular ? 'rgba(255,255,255,0.75)' : '#64748b' }}>
                            {feature}
                        </span>
                    </li>
                ))}
            </ul>
        </motion.div>
    );
};
