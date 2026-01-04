import { request } from '@/utils/request';
import type { User, PageInfo } from '@/types/api';

// 1. 获取当前用户信息
// 返回值类型：Promise<User>
export const getCurrentUserInfo = () => {
    return request.get<User>('/sys/users/me');
};

// 2. 获取用户列表
// 返回值类型：Promise<PageInfo<User>>
export const getUsers = (params?: { page?: number; size?: number }) => {
    return request.get<PageInfo<User>>('/sys/users', { params });
};

// 3. 获取单个用户详情
// 返回值类型：Promise<User>
export const getUserById = (id: number) => {
    return request.get<User>(`/sys/users/${id}`);
};

// 4. 创建用户
// 返回值类型：Promise<User>
export const createUser = (data: Omit<User, 'id' | 'created_at' | 'updated_at'>) => {
    return request.post<User>('/sys/users', data);
};

// 5. 更新用户
// 返回值类型：Promise<User>
export const updateUser = (id: number, data: Partial<User>) => {
    return request.put<User>(`/sys/users/${id}`, data);
};

// 6. 删除用户
// 返回值类型：Promise<{ message: string }> 或者 void
export const deleteUser = (id: number) => {
    return request.delete<{ message: string }>(`/sys/users/${id}`);
};
