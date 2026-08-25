export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';

export interface IOrderUser {
    id: string;
    name: string;
    email: string;
}

export interface IOrderItemProduct {
    id: string;
    name: string;
}

export interface IOrderItem {
    id: string;
    quantity: number;
    priceAtOrder: number;
    product: IOrderItemProduct;
}

export interface IOrder {
    id: string;
    status: OrderStatus;
    totalAmount: number;
    createdAt: string;
    updatedAt: string;
}

export interface IOrderListItem extends IOrder {
    user: IOrderUser;
    itemsCount: number;
}

export interface IOrderDetail extends IOrder {
    userId: string;
    user: IOrderUser;
    items: IOrderItem[];
}

export interface IOrdersList {
    items: IOrderListItem[];
    total: number;
    page: number;
    pageSize: number;
}
