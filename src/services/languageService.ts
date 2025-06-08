import apiClient from '../api/apiClient';
import type { languageTypes } from '../types'; // languageTypes interface'ini import et

export const getAllLanguages = async (): Promise<languageTypes[]> => {
    try {
        const response = await apiClient.get<languageTypes[]>('/languages');
        return response.data;
    } catch (error) {
        console.error('Diller alınırken hata oluştu:', error);
        throw error;
    }
};