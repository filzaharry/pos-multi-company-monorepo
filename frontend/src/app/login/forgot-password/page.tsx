'use client';

import React, { Suspense } from 'react';
import { ForgotPasswordLayout } from '@/lib/modules/login/components/ForgotPasswordLayout';

export default function ForgotPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <ForgotPasswordLayout />
        </Suspense>
    );
}
