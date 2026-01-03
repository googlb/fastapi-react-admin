import service from '@/utils/request';
import type { ApiResponse, User, PageInfo } from '@/types/api';

// 用户相关接口
export const getCurrentUserInfo = (): Promise<ApiResponse<User>> => {
    return service.get('/sys/users/me');
};

export const getUsers = (params?: { page?: number; size?: number }): Promise<ApiResponse<PageInfo<User>>> => {
    return service.get('/sys/users', { params });
};

export const getUserById = (id: number): Promise<ApiResponse<User>> => {
    return service.get(`/sys/users/${id}`);
};

export const createUser = (data: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<User>> => {
    return service.post('/sys/users', data);
};

export const updateUser = (id: number, data: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>): Promise<ApiResponse<User>> => {
    return service.put(`/sys/users/${id}`, data);
};

export const deleteUser = (id: number): Promise<ApiResponse<{ message: string }>> => {
    return service.delete(`/sys/users/${id}`);
};