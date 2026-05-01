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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6 rounded-xl glass-effect p-8 transition-transform hover:-translate-y-2 border border-blue-100 dark:border-white/5 shadow-sm"
        >
            <div className="w-14 h-14 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-3xl">{icon}</span>
            </div>
            <div className="flex flex-col gap-2">
                <h3 className="text-gray-900 dark:text-white text-xl font-bold">{title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                    {description}
                </p>
            </div>
        </motion.div>
    );
};
