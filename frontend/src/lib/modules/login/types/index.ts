

export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    role?: {
        id: number;
        name: string;
        permissions?: Array<{
            id: number;
            name: string;
            slug: string;
        }>;
    };
    company_id?: number;
    company?: {
        id: number;
        name: string;
        email: string;
    };
}

export interface LoginResponse {
    user: User;
    access_token: string;
    refresh_token: string;
}

export interface LoginPayload {
    email: string;
    password?: string;
    rememberMe?: boolean;
}

export interface LoginState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    activeCompanyId: number | null;
    requestOTP: (payload: LoginPayload) => Promise<void>;
    verifyOTP: (email: string, otp: string) => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    verifyResetOTP: (email: string, otp: string) => Promise<void>;
    resetPassword: (email: string, otp: string, newPassword: string) => Promise<void>;
    logout: () => void;
    getMe: () => Promise<void>;
    uploadAvatar: (file: File) => Promise<void>;
    setActiveCompanyId: (id: number | null) => void;
}
