import { authRequired } from '../../../utils/request';
import { UserEntity } from '../types/api';

export const getCurrentUserRequest = () => {
    return authRequired.get<UserEntity>('/user/me');
};
