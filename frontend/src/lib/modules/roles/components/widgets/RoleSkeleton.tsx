'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface RoleSkeletonProps {
    count?: number;
    isMobile?: boolean;
}

export const RoleSkeleton: React.FC<RoleSkeletonProps> = ({ count = 6, isMobile }) => {
    return (
        <>
            {[...Array(count)].map((_, i) => (
                <div 
                    key={i} 
                    className={cn(
                        "bg-white/5 border border-white/10 rounded-2xl animate-pulse",
                        isMobile ? "p-4 h-32" : "h-48"
                    )} 
                />
            ))}
        </>
    );
};
