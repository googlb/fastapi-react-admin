import { request } from '@/utils/request';
import type { Menu, PageInfo } from '@/types/api';

// 1. 获取当前用户菜单
// 返回值类型：Promise<Menu[]>
export const getMyMenus = () => {
    return request.get<Menu[]>('/sys/menus/me');
};

// 2. 获取菜单列表
// 返回值类型：Promise<PageInfo<Menu>>
export const getMenus = (params?: { page?: number; size?: number }) => {
    return request.get<PageInfo<Menu>>('/sys/menus', { params });
};

// 3. 获取菜单树
// 返回值类型：Promise<Menu[]>
export const getMenuTree = (params?: { parent_id?: number }) => {
    return request.get<Menu[]>('/sys/menus/tree', { params });
};

// 4. 获取单个菜单详情
// 返回值类型：Promise<Menu>
export const getMenuById = (id: number) => {
    return request.get<Menu>(`/sys/menus/${id}`);
};

// 5. 创建菜单
// 返回值类型：Promise<Menu>
export const createMenu = (data: Omit<Menu, 'id' | 'created_at' | 'updated_at' | 'children'>) => {
    return request.post<Menu>('/sys/menus', data);
};

// 6. 更新菜单
// 返回值类型：Promise<Menu>
export const updateMenu = (id: number, data: Partial<Menu>) => {
    return request.put<Menu>(`/sys/menus/${id}`, data);
};

// 7. 删除菜单
// 返回值类型：Promise<{ message: string }> 或者 void
export const deleteMenu = (id: number) => {
    return request.delete<{ message: string }>(`/sys/menus/${id}`);
};