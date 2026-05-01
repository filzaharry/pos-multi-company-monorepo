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
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay }}
            viewport={{ once: true }}
            className="flex flex-col gap-6 rounded-xl glass-effect p-8 border border-gray-200 dark:border-white/10 shadow-lg"
        >
            <div className="flex items-center gap-4">
                {avatar ? (
                    <img alt={name} className="w-14 h-14 rounded-full object-cover border-2 border-primary/20" src={avatar} />
                ) : (
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                        <User className="text-primary w-6 h-6" />
                    </div>
                )}

                <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>
                </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 italic leading-relaxed">
                &ldquo;{content}&rdquo;
            </p>
            <div className="flex text-primary gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-sm font-fill">star</span>
                ))}
            </div>
        </motion.div>
    );
};
