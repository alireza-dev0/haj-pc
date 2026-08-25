import type { OrderStatus } from './order';
import type { UserRole } from './user';

export interface ISearchProduct {
    id: string;
    name: string;
    thumbnail?: string | null;
}

export interface ISearchUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

export interface ISearchOrderUser {
    name: string;
    email: string;
}

export interface ISearchOrder {
    id: string;
    status: OrderStatus;
    totalAmount: number;
    user?: ISearchOrderUser;
}

export interface ISearchCategory {
    id: string;
    name: string;
    slug: string;
}

export interface IGlobalSearch {
    products: ISearchProduct[];
    users: ISearchUser[];
    orders: ISearchOrder[];
    categories: ISearchCategory[];
}
