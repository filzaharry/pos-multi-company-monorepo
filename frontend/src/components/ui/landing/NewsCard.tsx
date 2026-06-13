import React from 'react';

interface NewsCardProps {
    title: string;
    bannerUrl: string;
    content: string;
    date?: string;
}

export const NewsCard: React.FC<NewsCardProps> = ({ title, bannerUrl, content, date }) => {
    return (
        <div
            className="flex flex-col rounded-2xl overflow-hidden cursor-pointer group hover:-translate-y-1 transition-all duration-300 h-full"
            style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
            }}
        >
            <div className="relative w-full h-48 overflow-hidden bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={bannerUrl}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                />
            </div>
            <div className="p-5 flex flex-col flex-1 gap-2.5">
                {date && (
                    <span className="text-xs font-bold      " style={{ color: '#22c55e' }}>
                        {date}
                    </span>
                )}
                <h3 className="text-base font-bold text-slate-900 line-clamp-2 leading-snug">
                    {title}
                </h3>
                <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed flex-1">
                    {content}
                </p>
                <div className="mt-3 flex items-center gap-1 text-sm font-semibold" style={{ color: '#16a34a' }}>
                    Read more
                    <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
            </div>
        </div>
    );
};
