'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
    icon: string;
    title: string;
    description: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col gap-5 rounded-2xl p-7 card-hover relative overflow-hidden group"
            style={{
                background: 'rgba(44, 24, 16, 0.6)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                border: '1px solid rgba(192, 57, 43, 0.2)',
            }}
        >
            {/* Subtle gradient hover glow */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                style={{ background: 'linear-gradient(135deg, rgba(192, 57, 43, 0.08) 0%, rgba(230, 126, 34, 0.08) 100%)' }}
            />

            <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-white relative z-10"
                style={{ background: 'linear-gradient(135deg, #C0392B, #E67E22)', boxShadow: '0 8px 24px rgba(192, 57, 43, 0.3)' }}
            >
                <span className="material-symbols-outlined text-2xl">{icon}</span>
            </div>

            <div className="flex flex-col gap-2 relative z-10">
                <h3
                    className="text-white text-xl font-bold"
                    style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
                >
                    {title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-lato), Lato, sans-serif' }}>
                    {description}
                </p>
            </div>

            {/* Bottom accent line */}
            <div
                className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500"
                style={{ background: 'linear-gradient(90deg, #C0392B, #E67E22)' }}
            />
        </motion.div>
    );
};
