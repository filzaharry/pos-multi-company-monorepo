'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Layout as RoleModuleLayout } from '@/lib/modules/roles/components/Layout';

export default function RoleManagementPage() {
    return (
        <DashboardLayout>
            <RoleModuleLayout />
        </DashboardLayout>
    );
}
