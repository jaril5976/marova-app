
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserRequest } from '../imports/Auth/requests/authRequests';
import useAuthStore from '../zustand/useAuthStore';
import Toast from 'react-native-toast-message';

export function useUpdateUserMutation() {
    const { setUser } = useAuthStore();
    const queryClient = useQueryClient();

    const updateUserMutation = useMutation({
        mutationFn: (payload: any) => updateUserRequest(payload),
        onSuccess: (response) => {
            const updatedUser = response.data;
            if (updatedUser) {
                setUser(updatedUser);
                queryClient.invalidateQueries({ queryKey: ['user'] });
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Profile updated successfully',
                    position: 'top',
                });
            }
        },
        onError: (error: any) => {
            console.error('Update profile failed', error);
            Toast.show({
                type: 'error',
                text1: 'Update Failed',
                text2: error?.response?.data?.message || 'Something went wrong. Please try again.',
                position: 'top',
            });
        },
    });

    return { updateUserMutation };
}
