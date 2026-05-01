'use client';

import { getCookie } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { LogoutModal } from '@/components/modals/LogoutModal';
import { useLogin } from '@/lib/modules/login/store/useLogin';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const router = useRouter();
    const { user, logout, getMe, isLoading: isUserLoading } = useLogin();

    // Auth Guard & User Sync
    React.useEffect(() => {
        const token = getCookie('accessToken');

        if (!token) {
            router.push('/login');
            return;
        }

        if (!user && !isUserLoading) {
            getMe();
        }
    }, [router, user, getMe, isUserLoading]);

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        logout();
        setShowLogoutModal(false);
        router.push('/');
    };

    return (
        <div className="flex h-screen bg-background-dark overflow-hidden">
            <Sidebar
                isOpen={isSidebarOpen}
                onLogout={handleLogout}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Navbar 
                    user={user} 
                    isSidebarOpen={isSidebarOpen} 
                    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
                />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-8 prose-invert max-w-none scroll-smooth">
                    {children}
                </main>
            </div>

            <LogoutModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={confirmLogout}
            />
        </div>
    );
};
