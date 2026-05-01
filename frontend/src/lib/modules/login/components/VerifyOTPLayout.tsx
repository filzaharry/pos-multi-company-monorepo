'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLogin } from '../store/useLogin';
import { VerifyOTPMobile } from './VerifyOTPMobile';
import { VerifyOTPDesktop } from './VerifyOTPDesktop';

export const VerifyOTPLayout = () => {
    const [isMobile, setIsMobile] = useState(false);
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';
    const { isLoading, error, verifyOTP } = useLogin();

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const props = {
        email,
        isLoading,
        error,
        verifyOTP
    };

    if (isMobile) {
        return <VerifyOTPMobile {...props} />;
    }

    return <VerifyOTPDesktop {...props} />;
};
