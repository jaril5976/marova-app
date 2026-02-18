import { RequestStatus, UserEntity } from '../types/api';
import { useCurrentUserQuery } from './useCurrentUserQuery';

export interface UseCurrentUserReturnValue {
    currentUserData: UserEntity | null;
    status: RequestStatus;
}

export function useCurrentUser(): UseCurrentUserReturnValue {
    const { data: currentUser, status } = useCurrentUserQuery();

    return {
        currentUserData: currentUser ?? null,
        status: status as RequestStatus,
    };
}
