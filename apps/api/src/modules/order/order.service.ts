import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus, Prisma } from 'app/prisma/generated/client';
import { PrismaService } from '../shared/prisma.service';

const STATUS_FLOW: OrderStatus[] = [
    OrderStatus.PENDING,
    OrderStatus.PROCESSING,
    OrderStatus.SHIPPED,
    OrderStatus.DELIVERED,
];

const orderUserSelect = {
    id: true,
    name: true,
    email: true,
} satisfies Prisma.UserSelect;

const orderDetailInclude = {
    user: { select: orderUserSelect },
    items: {
        select: {
            id: true,
            quantity: true,
            priceAtOrder: true,
            product: { select: { id: true, name: true } },
        },
    },
} satisfies Prisma.OrderInclude;

type get_orders_input = {
    q: string;
    status?: OrderStatus;
    page: number;
    pageSize: number;
};

type order_user = {
    id: string;
    name: string;
    email: string;
};

type get_orders_output = {
    items: {
        id: string;
        status: OrderStatus;
        totalAmount: number;
        user: order_user;
        itemsCount: number;
        createdAt: Date;
        updatedAt: Date;
    }[];
    total: number;
    page: number;
    pageSize: number;
};

type order_detail_output = {
    id: string;
    status: OrderStatus;
    totalAmount: number;
    userId: string;
    user: order_user;
    items: {
        id: string;
        quantity: number;
        priceAtOrder: number;
        product: { id: string; name: string };
    }[];
    createdAt: Date;
    updatedAt: Date;
};

@Injectable()
export class OrderService {
    constructor(private readonly prisma: PrismaService) {}

    async getOrders(input: get_orders_input): Promise<get_orders_output> {
        const where: Prisma.OrderWhereInput = {
            ...(input.status ? { status: input.status } : {}),
            ...(input.q
                ? {
                      OR: [
                          { id: { contains: input.q, mode: 'insensitive' } },
                          {
                              user: {
                                  name: { contains: input.q, mode: 'insensitive' },
                              },
                          },
                          {
                              user: {
                                  email: { contains: input.q, mode: 'insensitive' },
                              },
                          },
                      ],
                  }
                : {}),
        };

        const [orders, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (input.page - 1) * input.pageSize,
                take: input.pageSize,
                include: {
                    user: { select: orderUserSelect },
                    _count: { select: { items: true } },
                },
            }),
            this.prisma.order.count({ where }),
        ]);

        return {
            items: orders.map((order) => ({
                id: order.id,
                status: order.status,
                totalAmount: order.totalAmount,
                user: order.user,
                itemsCount: order._count.items,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
            })),
            total,
            page: input.page,
            pageSize: input.pageSize,
        };
    }

    async getOrderById(id: string): Promise<order_detail_output> {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: orderDetailInclude,
        });

        if (!order) {
            throw new NotFoundException('سفارش یافت نشد');
        }

        return order;
    }

    async updateOrderStatus(
        id: string,
        status: OrderStatus,
    ): Promise<order_detail_output> {
        const order = await this.getOrderById(id);

        if (!this.isForwardTransition(order.status, status)) {
            throw new BadRequestException(
                'تغییر وضعیت سفارش نامعتبر است. وضعیت فقط می‌تواند به جلو حرکت کند.',
            );
        }

        return this.prisma.order.update({
            where: { id },
            data: { status },
            include: orderDetailInclude,
        });
    }

    async deleteOrder(id: string): Promise<{ id: string }> {
        await this.getOrderById(id);
        await this.prisma.order.delete({ where: { id } });
        return { id };
    }

    private isForwardTransition(from: OrderStatus, to: OrderStatus): boolean {
        return STATUS_FLOW.indexOf(to) > STATUS_FLOW.indexOf(from);
    }
}
