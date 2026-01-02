export interface ApiResponse<T = any> {
    code: number;
    msg: string;
    data: T;
}

export interface User {
    id: number;
    username: string;
    email?: string;
    is_active: boolean;
    is_superuser: boolean;
    avatar?: string;
    roles?: any[];
    [key: string]: any;
}

export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
}

// 成功状态码
export const SUCCESS_CODE = 0;
export const ERROR_CODE = 500;
