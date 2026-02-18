
export interface UserAddress {
    id: string
    type: string
    street: string
    city: string
    zip: string
}

export interface UserEntity {
    id: string
    userId: number
    firstName: string
    lastName: string
    email: string
    phone: string
    gender: string
    dateOfBirth?: string
    avatarImage?: string
    addresses: UserAddress[]
    role: string
    createdAt: string
    updatedAt: string
}

export enum UserQueryKeys {
    CURRENT_USER = 'currentUser',
    ALL_USERS = 'allUsers',
}

export type RequestStatus = 'loading' | 'success' | 'error' | 'idle'
