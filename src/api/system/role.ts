import service from '@/utils/request';
import type { ApiResponse, Role, PageInfo } from '@/types/api';

// 角色相关接口
export const getRoles = (params?: { page?: number; size?: number }): Promise<ApiResponse<PageInfo<Role>>> => {
    return service.get('/sys/roles', { params });
};

export const getRoleById = (id: number): Promise<ApiResponse<Role>> => {
    return service.get(`/sys/roles/${id}`);
};

export const createRole = (data: Omit<Role, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Role>> => {
    return service.post('/sys/roles', data);
};

export const updateRole = (id: number, data: Partial<Omit<Role, 'id' | 'created_at' | 'updated_at'>>): Promise<ApiResponse<Role>> => {
    return service.put(`/sys/roles/${id}`, data);
};

export const deleteRole = (id: number): Promise<ApiResponse<{ message: string }>> => {
    return service.delete(`/sys/roles/${id}`);
};