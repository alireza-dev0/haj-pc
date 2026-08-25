export type UserRole = 'ADMIN' | 'USER';

export interface IUser {
    id: string;
    email: string;
    password: string;
    name: string;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
}

export type IPublicUser = Omit<IUser, 'password'>;

export interface IUsersList {
    items: IPublicUser[];
    total: number;
    page: number;
    limit: number;
}
