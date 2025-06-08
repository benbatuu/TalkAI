import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
import type { UserProfile, UserUpdateRequest } from '../types';
import { authKeys } from './authService';

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ userId, data }: { userId: string; data: Partial<UserUpdateRequest> }) => {
            const response = await apiClient.put<UserProfile>(`/user/${userId}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: authKeys.profile() });
        }
    });
};
