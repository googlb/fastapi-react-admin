import { request } from '@/utils/request';
import type { Role, PageInfo } from '@/types/api';

// 1. 获取角色列表
// 返回值类型：Promise<PageInfo<Role>>
export const getRoles = (params?: { page?: number; size?: number }) => {
    return request.get<PageInfo<Role>>('/sys/roles', { params });
};

// 2. 获取单个角色详情
// 返回值类型：Promise<Role>
export const getRoleById = (id: number) => {
    return request.get<Role>(`/sys/roles/${id}`);
};

// 3. 创建角色
// 返回值类型：Promise<Role>
export const createRole = (data: Omit<Role, 'id' | 'created_at' | 'updated_at'>) => {
    return request.post<Role>('/sys/roles', data);
};

// 4. 更新角色
// 返回值类型：Promise<Role>
export const updateRole = (id: number, data: Partial<Role>) => {
    return request.put<Role>(`/sys/roles/${id}`, data);
};

// 5. 删除角色
// 返回值类型：Promise<{ message: string }> 或者 void
export const deleteRole = (id: number) => {
    return request.delete<{ message: string }>(`/sys/roles/${id}`);
};