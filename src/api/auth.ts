import service from '@/utils/request';
import type { ApiResponse, LoginResponse } from '@/types/api';

export const login = (data: { username: string; password: string }): Promise<ApiResponse<LoginResponse>> => {
    return service.post('/sys/users/login', data);
};