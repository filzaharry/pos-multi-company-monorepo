'use client';

import { useEffect, useState } from 'react';
import { useLogin } from '../store/useLogin';
import { ForgotPasswordMobile } from './ForgotPasswordMobile';
import { ForgotPasswordDesktop } from './ForgotPasswordDesktop';

export const ForgotPasswordLayout = () => {
    const [isMobile, setIsMobile] = useState(false);
    const { isLoading, error, forgotPassword } = useLogin();

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
        forgotPassword
    };

    if (isMobile) {
        return <ForgotPasswordMobile {...props} />;
    }

    return <ForgotPasswordDesktop {...props} />;
};
