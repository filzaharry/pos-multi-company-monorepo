import { apiHandler } from '@/lib/api/handler';
import { ApiResponse } from '@/lib/types/api';
import { LoginPayload, LoginResponse, User } from '../types';

export const loginService = {
    requestOTP: (payload: LoginPayload) => {
        return apiHandler<ApiResponse<{ email: string }>>((baseUrl) => 
            fetch(`${baseUrl}/auth/login/otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
        );
    },
    verifyOTP: (email: string, otp: string) => {
        return apiHandler<ApiResponse<LoginResponse>>((baseUrl) => 
            fetch(`${baseUrl}/auth/login/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            })
        );
    },
    getMe: (token: string) => {
        return apiHandler<ApiResponse<User>>((baseUrl) => 
            fetch(`${baseUrl}/auth/me`, {
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
        );
    },
    refreshToken: (refreshToken: string) => {
        return apiHandler<ApiResponse<{ access_token: string; refresh_token: string }>>((baseUrl) => 
            fetch(`${baseUrl}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh_token: refreshToken })
            })
        );
    }
};
