
export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
}


export interface IUser {

    id: string;
    name: string;
    email: string;
    password: string;

    role: UserRole;

    // orders: Order[];

    createdAt: string;
    updatedAt: string;
}