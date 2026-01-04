import { request } from '@/utils/request';
import type { Dict, DictData, PageInfo } from '@/types/api';

// 1. 获取字典列表
// 返回值类型：Promise<PageInfo<Dict>>
export const getDicts = (params?: { page?: number; size?: number }) => {
    return request.get<PageInfo<Dict>>('/sys/dicts', { params });
};

// 2. 获取单个字典详情
// 返回值类型：Promise<Dict>
export const getDictById = (id: number) => {
    return request.get<Dict>(`/sys/dicts/${id}`);
};

// 3. 根据字典编码获取字典
// 返回值类型：Promise<{ id: number; name: string; code: string; description?: string; created_at: string; updated_at: string; data: DictData[]; }>
export const getDictByCode = (code: string) => {
    return request.get<{ 
        id: number; 
        name: string; 
        code: string; 
        description?: string;
        created_at: string;
        updated_at: string;
        data: DictData[]; 
    }>(`/sys/dicts/code/${code}`);
};

// 4. 创建字典
// 返回值类型：Promise<Dict>
export const createDict = (data: Omit<Dict, 'id' | 'created_at' | 'updated_at'>) => {
    return request.post<Dict>('/sys/dicts', data);
};

// 5. 更新字典
// 返回值类型：Promise<Dict>
export const updateDict = (id: number, data: Partial<Dict>) => {
    return request.put<Dict>(`/sys/dicts/${id}`, data);
};

// 6. 删除字典
// 返回值类型：Promise<{ message: string }> 或者 void
export const deleteDict = (id: number) => {
    return request.delete<{ message: string }>(`/sys/dicts/${id}`);
};

// 字典数据相关接口
// 7. 获取字典数据列表
// 返回值类型：Promise<PageInfo<DictData>>
export const getDictData = (dictId: number, params?: { page?: number; size?: number }) => {
    return request.get<PageInfo<DictData>>(`/sys/dicts/${dictId}/data`, { params });
};

// 8. 创建字典数据
// 返回值类型：Promise<DictData>
export const createDictData = (dictId: number, data: Omit<DictData, 'id' | 'created_at' | 'updated_at'>) => {
    return request.post<DictData>(`/sys/dicts/${dictId}/data`, data);
};

// 9. 更新字典数据
// 返回值类型：Promise<DictData>
export const updateDictData = (id: number, data: Partial<DictData>) => {
    return request.put<DictData>(`/sys/dicts/data/${id}`, data);
};

// 10. 删除字典数据
// 返回值类型：Promise<{ message: string }> 或者 void
export const deleteDictData = (id: number) => {
    return request.delete<{ message: string }>(`/sys/dicts/data/${id}`);
};