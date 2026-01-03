import service from '@/utils/request';
import type { ApiResponse, Menu, PageInfo } from '@/types/api';

// 菜单相关接口
export const getMyMenus = (): Promise<ApiResponse<Menu[]>> => {
    return service.get('/sys/menus/me');
};

export const getMenus = (params?: { page?: number; size?: number }): Promise<ApiResponse<PageInfo<Menu>>> => {
    return service.get('/sys/menus', { params });
};

export const getMenuTree = (params?: { parent_id?: number }): Promise<ApiResponse<Menu[]>> => {
    return service.get('/sys/menus/tree', { params });
};

export const getMenuById = (id: number): Promise<ApiResponse<Menu>> => {
    return service.get(`/sys/menus/${id}`);
};

export const createMenu = (data: Omit<Menu, 'id' | 'created_at' | 'updated_at' | 'children'>): Promise<ApiResponse<Menu>> => {
    return service.post('/sys/menus', data);
};

export const updateMenu = (id: number, data: Partial<Omit<Menu, 'id' | 'created_at' | 'updated_at'>>): Promise<ApiResponse<Menu>> => {
    return service.put(`/sys/menus/${id}`, data);
};

export const deleteMenu = (id: number): Promise<ApiResponse<{ message: string }>> => {
    return service.delete(`/sys/menus/${id}`);
};