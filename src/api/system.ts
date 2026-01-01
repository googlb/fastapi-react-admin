import service from '@/utils/request';
import type { ApiResponse } from '@/types/api';

export interface Menu {
    id: number;
    parent_id: number | null;
    title: string;
    path: string;
    name: string;
    component: string;
    icon: string;
    sort: number;
    menu_type: number;
    hidden?: boolean;
    children?: Menu[];
}

export const getMyMenus = (): Promise<ApiResponse<Menu[]>> => {
    return service.get('/sys/menus/me');
};
