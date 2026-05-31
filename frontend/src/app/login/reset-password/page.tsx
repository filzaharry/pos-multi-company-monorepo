'use client';

import React, { Suspense } from 'react';
import { ResetPasswordLayout } from '@/lib/modules/login/components/ResetPasswordLayout';

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <ResetPasswordLayout />
        </Suspense>
    );
}
