'use client';

import React, { Suspense } from 'react';
import { VerifyOTPLayout } from '@/lib/modules/login/components/VerifyOTPLayout';

export default function VerifyOTPPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background-dark" />}>
            <VerifyOTPLayout />
        </Suspense>
    );
}
