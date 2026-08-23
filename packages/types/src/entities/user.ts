export enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

export interface IUser {
    id: string;
    email: string;
    password: string;
    name: string;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
}
