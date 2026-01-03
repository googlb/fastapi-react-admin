import service from '@/utils/request';
import type { ApiResponse, Dict, DictData, PageInfo } from '@/types/api';

// 字典相关接口
export const getDicts = (params?: { page?: number; size?: number }): Promise<ApiResponse<PageInfo<Dict>>> => {
    return service.get('/sys/dicts', { params });
};

export const getDictById = (id: number): Promise<ApiResponse<Dict>> => {
    return service.get(`/sys/dicts/${id}`);
};

export const getDictByCode = (code: string): Promise<ApiResponse<{ 
    id: number; 
    name: string; 
    code: string; 
    description?: string;
    created_at: string;
    updated_at: string;
    data: DictData[]; 
}>> => {
    return service.get(`/sys/dicts/code/${code}`);
};

export const createDict = (data: Omit<Dict, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Dict>> => {
    return service.post('/sys/dicts', data);
};

export const updateDict = (id: number, data: Partial<Omit<Dict, 'id' | 'created_at' | 'updated_at'>>): Promise<ApiResponse<Dict>> => {
    return service.put(`/sys/dicts/${id}`, data);
};

export const deleteDict = (id: number): Promise<ApiResponse<{ message: string }>> => {
    return service.delete(`/sys/dicts/${id}`);
};

// 字典数据相关接口
export const getDictData = (dictId: number, params?: { page?: number; size?: number }): Promise<ApiResponse<PageInfo<DictData>>> => {
    return service.get(`/sys/dicts/${dictId}/data`, { params });
};

export const createDictData = (dictId: number, data: Omit<DictData, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<DictData>> => {
    return service.post(`/sys/dicts/${dictId}/data`, data);
};

export const updateDictData = (id: number, data: Partial<Omit<DictData, 'id' | 'created_at' | 'updated_at'>>): Promise<ApiResponse<DictData>> => {
    return service.put(`/sys/dicts/data/${id}`, data);
};

export const deleteDictData = (id: number): Promise<ApiResponse<{ message: string }>> => {
    return service.delete(`/sys/dicts/data/${id}`);
};