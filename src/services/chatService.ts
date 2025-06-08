import apiClient from '../api/apiClient';

export const createChatViaText = async (message: string, roomId?: string) => {
    const requestBody = {
        message: message,
        ...(roomId && { roomId: roomId })
    };
    const response = await apiClient.post('/chats', requestBody);
    return response.data;
};

export const deleteChatRoom = async (roomId: string) => {
    const requestBody = {
        roomId: roomId
    };
    const response = await apiClient.delete(`/chats`, { data: requestBody });
    return response.data;
}

export const getSingleChatRoom = async (roomId: string) => {
    const response = await apiClient.get(`/chats/${roomId}`);
    return response.data;
}

export const createChatRoom = async () => {
    const response = await apiClient.post('/chats/room');
    return response.data;
}