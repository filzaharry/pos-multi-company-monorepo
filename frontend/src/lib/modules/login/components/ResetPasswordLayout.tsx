'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLogin } from '../store/useLogin';
import { ResetPasswordMobile } from './ResetPasswordMobile';
import { ResetPasswordDesktop } from './ResetPasswordDesktop';

export const ResetPasswordLayout = () => {
    const [isMobile, setIsMobile] = useState(false);
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';
    const otp = searchParams.get('otp') || '';
    const { isLoading, error, resetPassword } = useLogin();

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
        otp,
        isLoading,
        error,
        resetPassword
    };

    if (isMobile) {
        return <ResetPasswordMobile {...props} />;
    }

    return <ResetPasswordDesktop {...props} />;
};
