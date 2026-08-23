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
