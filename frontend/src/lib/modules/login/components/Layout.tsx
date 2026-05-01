'use client';

import React, { useEffect, useState } from 'react';
import { Desktop } from './Desktop';
import { Mobile } from './Mobile';
import { useLogin } from '../store/useLogin';

export const Layout = () => {
    const [isMobile, setIsMobile] = useState(false);
    const { isLoading, error, requestOTP, verifyOTP } = useLogin();

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const props = {
        isLoading,
        error,
        requestOTP,
        verifyOTP
    };

    if (isMobile) {
        return <Mobile {...props} />;
    }

    return <Desktop {...props} />;
};
