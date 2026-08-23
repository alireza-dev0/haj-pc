export enum OrderStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
}

export interface IOrder {
    id: string;
    status: OrderStatus;
    totalAmount: number;
    createdAt: string;
    updatedAt: string;
}

export interface IOrderItem {
    id: string;
    quantity: number;
    priceAtOrder: number;
}
