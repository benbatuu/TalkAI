import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
import axios from 'axios';
import type { AuthorizeResponse, LoginRequest, LoginResponse, UserRegisterRequest, UserProfile } from '../types';

// Types
interface ResetPasswordParams {
    token: string;
    newPassword: string;
}

// Constants
const STALE_TIME = 1000 * 60 * 5; // 5 minutes
const GC_TIME = 1000 * 60 * 30; // 30 minutes
const REQUEST_TIMEOUT = 10000; // 10 seconds

const authClient = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: REQUEST_TIMEOUT
});

// Query Keys
interface OTPVerifyResponse {
    success: boolean;
    message: string;
}

export const authKeys = {
    all: ['auth'] as const,
    profile: () => [...authKeys.all, 'profile'] as const,
    login: () => [...authKeys.all, 'login'] as const,
    register: () => [...authKeys.all, 'register'] as const,
    logout: () => [...authKeys.all, 'logout'] as const,
    verifyOtp: () => [...authKeys.all, 'verifyOtp'] as const,
    resendOtp: () => [...authKeys.all, 'resendOtp'] as const
};

// Helper function
const clearLocalStorage = () => localStorage.clear();

// Auth Hooks
export const useAuthorize = () => {
    return useMutation({
        mutationFn: async () => {
            const key = import.meta.env.VITE_APP_AUTH_KEY;
            const secret = import.meta.env.VITE_APP_AUTH_SECRET;

            if (!key || !secret) {
                throw new Error('Authorization credentials are not set.');
            }

            const response = await authClient.post<AuthorizeResponse>('/auth/authorize', { key, secret });
            return response.data.access_token;
        },
        retry: 1
    });
};

export const useLogin = () => {
    const queryClient = useQueryClient();
    const authorize = useAuthorize();
    
    return useMutation({
        mutationFn: async (credentials: LoginRequest) => {
            // First get authorization token
            const authToken = await authorize.mutateAsync();
            
            // Use the auth token to make login request
            const response = await authClient.post<LoginResponse>(
                '/auth/login',
                credentials,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                }
            );

            // Store the tokens from successful login
            localStorage.setItem('accessToken', response.data.accesstoken);
            localStorage.setItem('refreshToken', response.data.refreshtoken);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: authKeys.profile() });
        },
        onError: (error) => {
            clearLocalStorage();
            throw error;
        }
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async () => {
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    await apiClient.post('/auth/logout', { refreshtoken: refreshToken });
                }
            } finally {
                clearLocalStorage();
            }
        },
        onSettled: () => {
            queryClient.clear();
            window.location.href = '/login';
        }
    });
};

export const useRegister = () => {
    return useMutation({
        mutationFn: async (userData: UserRegisterRequest) => {
            const response = await apiClient.post('/auth/register', userData);
            return response.data;
        },
        retry: 0
    });
};

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: async (email: string) => {
            const response = await apiClient.post('/auth/forgot-password', { email });
            return response.data;
        },
        retry: 0
    });
};

export const useResetPassword = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ token, newPassword }: ResetPasswordParams) => {
            const response = await apiClient.put(`/auth/reset-password/${token}`, { password: newPassword });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: authKeys.profile() });
        },
        retry: 0
    });
};

export const useVerifyOTP = () => {
    return useMutation({
        mutationFn: async ({ email, otpCode }: { email: string; otpCode: string }) => {
            const response = await apiClient.post<OTPVerifyResponse>('/auth/verify-otp', {
                email,
                otpCode
            });
            return response.data;
        },
        retry: 0
    });
};

export const useResendOTP = () => {
    return useMutation({
        mutationFn: async (email: string) => {
            const response = await apiClient.post<OTPVerifyResponse>('/auth/resend-otp', { email });
            return response.data;
        },
        retry: 1
    });
};

export const useUserProfile = () => {
    return useQuery({
        queryKey: authKeys.profile(),
        queryFn: async () => {
            const response = await apiClient.get<UserProfile>('/user/profile');
            return response.data;
        },
        enabled: !!localStorage.getItem('accessToken'),
        staleTime: STALE_TIME,
        gcTime: GC_TIME,
        retry: false,
        refetchOnWindowFocus: true,
        refetchOnMount: true
    });
};
