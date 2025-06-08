import axios from 'axios';
import { getStoredRefreshToken, clearStoredTokens, setStoredTokens } from '../helpers/auth.helper';
import { authorizeInterceptor } from './interceptors/authorizeInterceptor';

const API_URL = import.meta.env.VITE_APP_API_URL;

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add authorize interceptor for handling tokens
authorizeInterceptor(apiClient);

// Response interceptor for handling token refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Skip refresh token for auth-related requests
        if (originalRequest.url?.includes('/auth/')) {
            return Promise.reject(error);
        }

        // Attempt token refresh on 401 errors
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = getStoredRefreshToken();
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                const response = await axios.post(`${API_URL}/auth/refresh`, {
                    refreshToken,
                });

                const { accesstoken: newAccessToken, refreshtoken: newRefreshToken } = response.data;
                setStoredTokens(newAccessToken, newRefreshToken);
                
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                clearStoredTokens();
                window.dispatchEvent(new Event('auth:logout'));
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
