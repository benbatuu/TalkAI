import { type AxiosInstance } from 'axios';
import { getStoredAccessToken } from '../../helpers/auth.helper';

export const authorizeInterceptor = (api: AxiosInstance) => {
    api.interceptors.request.use(
        async (config) => {
            // For non-auth requests, add the stored access token
            if (!config.url?.includes('/auth/')) {
                const accessToken = getStoredAccessToken();
                if (accessToken) {
                    config.headers.Authorization = `Bearer ${accessToken}`;
                }
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    return api;
};
