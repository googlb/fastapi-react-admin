import service from '@/utils/request';

export const login = (data: any) => {
    return service.post('/sys/users/login', data);
};

export const getUserInfo = () => {
    return service.get('/sys/users/me');
}
