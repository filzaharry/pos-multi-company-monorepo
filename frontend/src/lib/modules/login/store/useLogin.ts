import { create } from 'zustand';
import { apiRouter } from '@/lib/api/router';
import { setCookie, deleteCookie, getCookie } from '@/lib/utils';
import { ApiResponse } from '@/lib/types/api';
import { LoginState, LoginPayload, LoginResponse, User } from '../types';

export const useLogin = create<LoginState>((set) => ({
    user: null,
    isLoading: false,
    error: null,
    activeCompanyId: null,

    requestOTP: async (payload: LoginPayload) => {
        set({ isLoading: true, error: null });
        try {
            const res = await apiRouter.post<ApiResponse<{ email: string }>>('/auth/login', payload);
            if (res.status === 'success' || res.status === 'Success') {
                set({ isLoading: false });
            } else {
                set({ error: res.data.message || 'Failed to send OTP', isLoading: false });
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to request OTP';
            set({ error: message, isLoading: false });
            throw error;
        }
    },

    verifyOTP: async (email: string, otp: string) => {
        set({ isLoading: true, error: null });
        try {
            const res = await apiRouter.post<ApiResponse<LoginResponse>>('/auth/verify-otp', { email, otp });
            if (res.status === 'success' || res.status === 'Success') {
                const { user, access_token, refresh_token } = res.data.result;
                
                set({ 
                    user, 
                    isLoading: false, 
                    activeCompanyId: user.company_id || null 
                });
                
                // Set tokens in cookies (30 days)
                setCookie('accessToken', access_token, 30);
                setCookie('refreshToken', refresh_token, 30);
            } else {
                set({ error: res.data.message || 'Invalid OTP', isLoading: false });
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Verification failed';
            set({ error: message, isLoading: false });
            throw error;
        }
    },

    logout: () => {
        set({ user: null, activeCompanyId: null });
        deleteCookie('accessToken');
        deleteCookie('refreshToken');
        if (typeof window !== 'undefined') {
            localStorage.clear();
            sessionStorage.clear();
        }
    },

    getMe: async () => {
        const token = getCookie('accessToken');
        if (!token) return;

        set({ isLoading: true });
        try {
            const res = await apiRouter.get<ApiResponse<User>>('/auth/me');
            if (res.status === 'success' || res.status === 'Success') {
                const user = res.data.result;
                set({ 
                    user, 
                    isLoading: false, 
                    activeCompanyId: user.company_id || null 
                });
            } else {
                set({ user: null, isLoading: false, activeCompanyId: null });
            }
        } catch {
            set({ user: null, isLoading: false, activeCompanyId: null });
            deleteCookie('accessToken');
            deleteCookie('refreshToken');
        }
    },

    uploadAvatar: async (file: File) => {
        set({ isLoading: true, error: null });
        try {
            const formData = new FormData();
            formData.append('image', file);
            const res = await apiRouter.upload<{ url: string }>('/user/upload-avatar', formData);
            set((state) => ({
                user: state.user ? { ...state.user, avatar: res.url } : null,
                isLoading: false,
            }));
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Upload failed';
            set({ error: errorMessage, isLoading: false });
        }
    },

    setActiveCompanyId: (id: number | null) => {
        set({ activeCompanyId: id });
    },
}));
