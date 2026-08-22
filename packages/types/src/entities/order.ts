

export enum OrderStatus {
    PENDING = 'pending',
    PAID = 'paid',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}


export interface IOrder {
    id: string;
    // user: User;
    total: number;

    status: OrderStatus;

    // items: OrderItem[];

    createdAt: string;
    updatedAt: string;
}

// OrderItem

export interface IOrderItem {
    id: string;
    // order: Order;
    // product: Product;
    quantity: number;
    price: number;
}