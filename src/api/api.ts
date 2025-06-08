import apiClient from './apiClient'; // apiClient import edildi

export const get = async <T = any>(path: string): Promise<T> => {
    const response = await apiClient.get<T>(path);
    return response.data;
};

export const post = async <T = any>(path: string, data: any): Promise<T> => {
    const response = await apiClient.post<T>(path, data);
    return response.data;
};

export const put = async <T = any>(path: string, data: any): Promise<T> => {
    const response = await apiClient.put<T>(path, data);
    return response.data;
};

export const patch = async <T = any>(path: string, data: any): Promise<T> => {
    const response = await apiClient.patch<T>(path, data);
    return response.data;
};

export const del = async <T = any>(path: string): Promise<T> => {
    const response = await apiClient.delete<T>(path);
    return response.data;
};

export const uploadDocument = async (data: FormData): Promise<any> => {
    const response = await apiClient.post('/spending/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};
