import React from 'react';
import Image from 'next/link';

interface NewsCardProps {
    title: string;
    bannerUrl: string;
    content: string;
    date?: string;
}

export const NewsCard: React.FC<NewsCardProps> = ({ title, bannerUrl, content, date }) => {
    return (
        <div className="flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:shadow-xl transition-all duration-300 group cursor-pointer h-full">
            <div className="relative w-full h-48 overflow-hidden bg-gray-100 dark:bg-black/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                    src={bannerUrl} 
                    alt={title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                />
            </div>
            <div className="p-6 flex flex-col flex-1 gap-3">
                {date && <span className="text-xs font-semibold text-primary uppercase tracking-wider">{date}</span>}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight">
                    {title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mt-auto">
                    {content}
                </p>
                <div className="mt-4 flex items-center text-primary font-semibold text-sm hover:underline">
                    Read more 
                    <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
                </div>
            </div>
        </div>
    );
};
