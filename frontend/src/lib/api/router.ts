import axios, { AxiosRequestConfig, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getCookie, setCookie, deleteCookie } from '../utils';

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || '/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

interface FailedRequest {
    resolve: (token: string | null) => void;
    reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Request interceptor
api.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? getCookie('accessToken') : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        const status = error.response?.status;

        // If error is 401 and we haven't retried yet
        if (status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(token => {
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = 'Bearer ' + token;
                        }
                        return api(originalRequest);
                    })
                    .catch(err => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = getCookie('refreshToken');
            if (refreshToken) {
                try {
                    const response = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {
                        refresh_token: refreshToken
                    });
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const { access_token, refresh_token } = (response.data as any).data.result;

                    setCookie('accessToken', access_token, 30);
                    setCookie('refreshToken', refresh_token, 30);

                    processQueue(null, access_token);
                    isRefreshing = false;

                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = 'Bearer ' + access_token;
                    }
                    return api(originalRequest);
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    isRefreshing = false;

                    // Clear tokens and redirect
                    deleteCookie('accessToken');
                    deleteCookie('refreshToken');
                    if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                        window.location.href = '/login';
                    }
                    return Promise.reject(refreshError);
                }
            } else {
                // No refresh token, redirect to login
                if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                    deleteCookie('accessToken');
                    window.location.href = '/login';
                }
            }
        }

        // Global error notification
        if (typeof window !== 'undefined' && status !== 401) {
            const errorData = error.response?.data as { message?: string } | undefined;
            const message = errorData?.message || error.message || 'An unexpected error occurred';
            window.dispatchEvent(new CustomEvent('app:toast', {
                detail: { message, type: 'error' }
            }));
        }

        return Promise.reject(error);
    }
);

export const apiRouter = {
    get: async <T>(url: string, config?: AxiosRequestConfig) => {
        const response = await api.get<T>(url, config);
        return response.data;
    },
    post: async <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>) => {
        const response = await api.post<T>(url, data, config);
        return response.data;
    },
    put: async <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>) => {
        const response = await api.put<T>(url, data, config);
        return response.data;
    },
    delete: async <T>(url: string, config?: AxiosRequestConfig) => {
        const response = await api.delete<T>(url, config);
        return response.data;
    },
    // For file uploads
    upload: async <T>(url: string, formData: FormData, config?: AxiosRequestConfig) => {
        const token = typeof window !== 'undefined' ? getCookie('accessToken') : null;

        // Ensure Content-Type is not set to application/json for FormData
        // This allows Axios to automatically set multipart/form-data with the correct boundary
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const headers: Record<string, any> = { ...config?.headers };
        if (headers['Content-Type']) {
            delete headers['Content-Type'];
        }

        const response = await axios.post<T>(`${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}${url}`, formData, {
            ...config,
            headers: {
                ...headers,
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
        });
        return response.data;
    },
    uploadPut: async <T>(url: string, formData: FormData, config?: AxiosRequestConfig) => {
        const token = typeof window !== 'undefined' ? getCookie('accessToken') : null;

        // Ensure Content-Type is not set to application/json for FormData
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const headers: Record<string, any> = { ...config?.headers };
        if (headers['Content-Type']) {
            delete headers['Content-Type'];
        }

        const response = await axios.put<T>(`${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}${url}`, formData, {
            ...config,
            headers: {
                ...headers,
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
        });
        return response.data;
    },
};
