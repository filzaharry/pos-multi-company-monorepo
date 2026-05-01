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
    title,
    price,
    features,
    isPopular,
    buttonText,
    buttonVariant = 'outline',
    delay = 0,
    href = '/checkout'
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay }}
            viewport={{ once: true }}
            className={cn(
                "relative flex flex-col gap-8 rounded-xl border p-8 transition-all hover:shadow-2xl hover:shadow-black/10",
                isPopular
                    ? "border-2 border-primary bg-white dark:bg-[#1d262f] shadow-2xl shadow-primary/10 lg:scale-105 z-10"
                    : "border-gray-200 dark:border-[#3a4d5f] bg-white dark:bg-[#1d262f]"
            )}
        >
            {isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                    Most Popular
                </div>
            )}
            <div className="flex flex-col gap-2">
                <h3 className={cn(
                    "text-sm font-bold uppercase tracking-widest",
                    isPopular ? "text-primary" : "text-gray-500 dark:text-gray-400"
                )}>{title}</h3>
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-gray-900 dark:text-white">${price}</span>
                    <span className="text-gray-500 font-bold">/mo</span>
                </div>
            </div>
            <Link href={href}>
                <button className={cn(
                    "w-full py-3 rounded-lg font-bold transition-all",
                    buttonVariant === 'primary' && "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20",
                    buttonVariant === 'outline' && "border-2 border-primary text-primary hover:bg-primary hover:text-white",
                    buttonVariant === 'secondary' && "border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                )}>
                    {buttonText}
                </button>
            </Link>

            <ul className="flex flex-col gap-4">
                {features.map((feature, index) => (
                    <li key={index} className="flex gap-3 text-sm items-center text-gray-600 dark:text-gray-300">
                        <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                        {feature}
                    </li>
                ))}
            </ul>
        </motion.div>
    );
};
