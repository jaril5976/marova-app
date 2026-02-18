import { useQuery, UseQueryResult } from '@tanstack/react-query';
import useAuthStore from '../../../zustand/useAuthStore';
import { getCurrentUserRequest } from '../requests/userRequests';
import { UserEntity, UserQueryKeys } from '../types/api';

export function useCurrentUserQuery(): UseQueryResult<UserEntity> {
    const { authToken, setUser } = useAuthStore();

    return useQuery({
        queryKey: [UserQueryKeys.CURRENT_USER],
        queryFn: async () => {
            const res = await getCurrentUserRequest();
            if (res.data) {
                setUser(res.data);
            }
            return res.data;
        },
        enabled: !!authToken,
        retry: false,
        refetchOnWindowFocus: false,
    });
}
