export interface ApiResponse<T = any> {
    code: number;
    msg: string;
    data: T;
    is_success?: boolean;
}

export interface PageInfo<T = any> {
    items: T[];
    total: number;
    page: number;
    size: number;
    pages: number;
}

export interface User {
    id: number;
    username: string;
    email?: string;
    is_active: boolean;
    is_superuser: boolean;
    last_login_at?: string;
    created_at: string;
    updated_at: string;
    remark?: string;
    role_ids?: number[];
    avatar?: string;
    roles?: any[];
    [key: string]: any;
}

export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
}

// Menu 接口定义
export interface Menu {
    id: number;
    parent_id: number | null;
    title: string;
    name: string;
    path: string | null;
    component: string | null;
    icon: string | null;
    sort: number;
    menu_type: number; // 1:目录 2:菜单 3:按钮
    is_visible: boolean;
    is_keep_alive: boolean;
    status: number; // 1:启用 0:禁用
    created_at: string; // ISO 8601 格式
    updated_at: string; // ISO 8601 格式
    hidden?: boolean;
    children?: Menu[];
}

// Role 接口定义
export interface Role {
    id: number;
    name: string;
    code: string;
    description?: string;
    status: number; // 1:启用 0:禁用
    created_at: string; // ISO 8601 格式
    updated_at: string; // ISO 8601 格式
    menu_ids?: number[];
}

// Dict 接口定义
export interface Dict {
    id: number;
    name: string;
    code: string;
    description?: string;
    status: number; // 1:启用 0:禁用
    created_at: string; // ISO 8601 格式
    updated_at: string; // ISO 8601 格式
}

// DictData 接口定义
export interface DictData {
    id: number;
    dict_id: number;
    label: string;
    value: string;
    sort: number;
    is_default: boolean;
    status: number; // 1:启用 0:禁用
    created_at: string; // ISO 8601 格式
    updated_at: string; // ISO 8601 格式
}

// 成功状态码
export const SUCCESS_CODE = 0;
export const ERROR_CODE = 500;