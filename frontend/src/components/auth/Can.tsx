'use client';

import React from 'react';
import { useLogin } from '@/lib/modules/login/store/useLogin';

interface CanProps {
    permission: string | string[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

/**
 * Component to wrap elements that require specific permissions.
 * Example: <Can permission="user.create"><button>Add User</button></Can>
 */
export const Can = ({ permission, children, fallback = null }: CanProps) => {
    const { user } = useLogin();

    if (!user || !user.role || !user.role.permissions) {
        return <>{fallback}</>;
    }

    // Super Admin always has access
    if (user.role.name === 'Super Admin') {
        return <>{children}</>;
    }

    const userPermissions = user.role.permissions.map(p => p.slug);
    const requiredPermissions = Array.isArray(permission) ? permission : [permission];

    // Check if user has ANY of the required permissions
    const hasAccess = requiredPermissions.some(p => userPermissions.includes(p));

    if (hasAccess) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
};

/**
 * Hook to check permission in logic.
 * Example: const canCreate = usePermission('user.create');
 */
export const usePermission = (permission: string | string[]) => {
    const { user } = useLogin();

    if (!user || !user.role || !user.role.permissions) {
        return false;
    }

    if (user.role.name === 'Super Admin') {
        return true;
    }

    const userPermissions = user.role.permissions.map(p => p.slug);
    const requiredPermissions = Array.isArray(permission) ? permission : [permission];

    return requiredPermissions.some(p => userPermissions.includes(p));
};
