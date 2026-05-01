'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Layout as UserModuleLayout } from '@/lib/modules/users/components/Layout';

export default function UserManagementPage() {
    return (
        <DashboardLayout>
            <UserModuleLayout />
        </DashboardLayout>
    );
}
