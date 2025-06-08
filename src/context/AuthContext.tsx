import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { getStoredAccessToken, setStoredTokens, clearStoredTokens } from '../helpers/auth.helper';
import type { UserProfile, AuthorizeResponse } from '../types';
import apiClient from '../api/apiClient';
import axios from 'axios';

interface AuthContextType {
    user: UserProfile | null;
    loading: boolean;
    error: Error | null;
    login: (credentials: { email: string; password: string }) => Promise<void>;
    logout: () => Promise<void>;
}

const authClient = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
    headers: { 'Content-Type': 'application/json' }
});

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Handle auth state
    const {
        data: user,
        isLoading: loading,
        error
    } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const token = getStoredAccessToken();
            if (!token) return null;

            try {
                const response = await apiClient.get<UserProfile>('/user/profile');
                return response.data;
            } catch (error) {
                clearStoredTokens();
                throw error;
            }
        },
        retry: false,
        refetchOnMount: true,
        refetchOnWindowFocus: false
    });

    // Authorize mutation
    const authorizeMutation = useMutation({
        mutationFn: async () => {
            const key = import.meta.env.VITE_APP_AUTH_KEY;
            const secret = import.meta.env.VITE_APP_AUTH_SECRET;

            if (!key || !secret) {
                throw new Error('Authorization credentials are not set.');
            }

            const response = await authClient.post<AuthorizeResponse>('/auth/authorize', { key, secret });
            return response.data.access_token;
        }
    });

    // Login mutation
    const loginMutation = useMutation({
        mutationFn: async ({ email, password, authToken }: { email: string; password: string; authToken: string }) => {
            const response = await authClient.post('/auth/login', 
                { email, password },
                { 
                    headers: { 
                        Authorization: `Bearer ${authToken}` 
                    } 
                }
            );
            return response.data;
        },
        onSuccess: (data) => {
            setStoredTokens(data.accesstoken, data.refreshtoken);
            queryClient.invalidateQueries({ queryKey: ['user'] });
        }
    });

    // Logout mutation
    const logoutMutation = useMutation({
        mutationFn: async () => {
            const response = await apiClient.post('/auth/logout');
            return response.data;
        },
        onSettled: () => {
            clearStoredTokens();
            queryClient.clear();
            navigate('/login');
        }
    });

    // Listen for auth:logout events
    useEffect(() => {
        const handleLogout = () => {
            clearStoredTokens();
            queryClient.clear();
            navigate('/login');
        };

        window.addEventListener('auth:logout', handleLogout);
        return () => window.removeEventListener('auth:logout', handleLogout);
    }, [navigate, queryClient]);

    // Protected route check
    useEffect(() => {
        const token = getStoredAccessToken();
        const isAuthRoute = ['/login', '/register', '/forgot-password', '/reset-password'].includes(
            window.location.pathname
        );

        if (!token && !isAuthRoute) {
            navigate('/login');
        }
    }, [navigate]);

    const login = async (credentials: { email: string; password: string }) => {
        // First get authorization token
        const authToken = await authorizeMutation.mutateAsync();

        // Then login with the auth token
        await loginMutation.mutateAsync({ ...credentials, authToken });
    };

    const logout = async () => {
        await logoutMutation.mutateAsync();
    };

    return (
        <AuthContext.Provider
            value={{
                user: user || null,
                loading: loading || loginMutation.isPending || logoutMutation.isPending || authorizeMutation.isPending,
                error: error as Error | null,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
