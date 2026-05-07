'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PosLayout } from '@/lib/modules/pos';

export default function POSPage() {
    return (
        <DashboardLayout>
            <PosLayout />
        </DashboardLayout>
    );
}
