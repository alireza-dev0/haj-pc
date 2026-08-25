import { Injectable } from '@nestjs/common';
import { OrderStatus, Prisma, UserRole } from 'app/prisma/generated/client';
import { PrismaService } from '../shared/prisma.service';

type search_input = {
    q: string;
    limit: number;
};

type search_product = {
    id: string;
    name: string;
    thumbnail: string | null;
};

type search_user = {
    id: string;
    name: string;
    email: string;
    role: UserRole;
};

type search_order = {
    id: string;
    status: OrderStatus;
    totalAmount: number;
    user?: { name: string; email: string };
};

type search_category = {
    id: string;
    name: string;
    slug: string;
};

type search_output = {
    products: search_product[];
    users: search_user[];
    orders: search_order[];
    categories: search_category[];
};

@Injectable()
export class SearchService {
    constructor(private readonly prisma: PrismaService) {}

    async search(input: search_input): Promise<search_output> {
        const contains: Prisma.StringFilter = {
            contains: input.q,
            mode: 'insensitive',
        };

        const [products, users, orders, categories] = await Promise.all([
            this.prisma.product.findMany({
                where: {
                    OR: [{ name: contains }, { description: contains }],
                },
                take: input.limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    images: {
                        where: { isPrimary: true },
                        take: 1,
                        select: { url: true },
                    },
                },
            }),
            this.prisma.user.findMany({
                where: {
                    OR: [{ name: contains }, { email: contains }],
                },
                take: input.limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            }),
            this.prisma.order.findMany({
                where: {
                    OR: [
                        { id: contains },
                        { user: { name: contains } },
                        { user: { email: contains } },
                    ],
                },
                take: input.limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    status: true,
                    totalAmount: true,
                    user: { select: { name: true, email: true } },
                },
            }),
            this.prisma.category.findMany({
                where: {
                    OR: [
                        { name: contains },
                        { slug: contains },
                        { description: contains },
                    ],
                },
                take: input.limit,
                orderBy: { name: 'asc' },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            }),
        ]);

        return {
            products: products.map((product) => ({
                id: product.id,
                name: product.name,
                thumbnail: product.images[0]?.url ?? null,
            })),
            users,
            orders,
            categories,
        };
    }
}
