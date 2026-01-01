import service from '@/utils/request';
import type { ApiResponse, LoginResponse, User } from '@/types/api';

export const login = (data: any): Promise<ApiResponse<LoginResponse>> => {
    return service.post('/sys/users/login', data);
};

export const getUserInfo = (): Promise<ApiResponse<User>> => {
    return service.get('/sys/users/me');
};
