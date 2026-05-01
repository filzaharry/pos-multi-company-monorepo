'use client';

import React, { useEffect, useState } from 'react';
import { Desktop } from './Desktop';
import { Mobile } from './Mobile';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export const Layout = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <DashboardLayout>
            {isMobile ? <Mobile /> : <Desktop />}
        </DashboardLayout>
    );
};
