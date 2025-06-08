export type Theme = 'light' | 'dark' | 'system';

export interface Message {
    id: string;
    roomId: string;
    userId: string;
    message: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export interface ChatRoom {
    id: string;
    userId: string;
    title: string;
    language: string;
    createdAt: string;
    updatedAt: string;
    messages: Message[];
    isActive?: boolean;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accesstoken: string;
    refreshtoken: string;
}

export interface AuthorizeResponse {
    access_token: string;
}

export interface UserProfile {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    learningLanguage?: string;
    avatar?: string;
    theme?: Theme;
    createdAt: string;
    updatedAt: string;
    chatRooms?: ChatRoom[];
}

export interface UserUpdateRequest {
    firstname?: string;
    lastname?: string;
    learningLanguage?: string;
    theme?: Theme;
}

export interface UserPasswordUpdateRequest {
    email: string;
    password: string;
    verifyPassword: string;
    token: string;
}

export interface UserRegisterRequest {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
}

export interface languageTypes {
    code: string;
    name: string;
    flag?: string;
}

export interface Error {
    message: string;
    code?: string;
    statusCode?: number;
}
