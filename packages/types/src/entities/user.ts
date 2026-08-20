import type { Order } from './order';

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
}


export interface User {

    id: string;
    name: string;
    email: string;
    password: string;

    role: UserRole;

    orders: Order[];

    createdAt: Date;
    updatedAt: Date;
}