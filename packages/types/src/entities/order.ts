
// Order

import type { Product } from './product';
import type { User } from './user';

export enum OrderStatus {
    PENDING = 'pending',
    PAID = 'paid',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}


export interface Order {
    id: string;
    user: User;
    total: number;

    status: OrderStatus;

    items: OrderItem[];

    createdAt: Date;
    updatedAt: Date;
}

// OrderItem

export interface OrderItem {
    id: string;
    order: Order;
    product: Product;
    quantity: number;
    price: number;
}