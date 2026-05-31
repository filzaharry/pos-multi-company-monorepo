'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

interface TestimonialCardProps {
    name: string;
    role: string;
    content: string;
    avatar?: string;
    delay?: number;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ name, role, content, avatar, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay }}
            viewport={{ once: true }}
            className="flex flex-col gap-5 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
            style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 20px rgba(0,0,0,0.04)',
            }}
        >
            {/* Stars */}
            <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <span
                        key={i}
                        className="material-symbols-outlined text-base"
                        style={{ color: '#22c55e', fontVariationSettings: "'FILL' 1", fontSize: 16 }}
                    >
                        star
                    </span>
                ))}
            </div>

            {/* Quote */}
            <p className="text-slate-600 text-sm leading-relaxed flex-1">
                &ldquo;{content}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid #f1f5f9' }}>
                {avatar ? (
                    <img
                        alt={name}
                        className="w-10 h-10 rounded-full object-cover"
                        src={avatar}
                        style={{ border: '2px solid rgba(34,197,94,0.25)' }}
                    />
                ) : (
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{
                            background: 'rgba(34,197,94,0.1)',
                            border: '2px solid rgba(34,197,94,0.2)',
                        }}
                    >
                        <User className="w-5 h-5" style={{ color: '#16a34a' }} />
                    </div>
                )}
                <div>
                    <h4 className="font-bold text-slate-900 text-sm">{name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{role}</p>
                </div>
            </div>
        </motion.div>
    );
};
