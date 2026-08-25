import { Injectable } from '@nestjs/common';
import { Prisma } from 'app/prisma/generated/client';
import { PrismaService } from '../shared/prisma.service';

type get_products_input = {
    search: string;
    categoryId?: string;
    sort: 'newest' | 'oldest';
    page: number;
    pageSize: number;
};

type get_products_output = {
    items: {
        id: string;
        name: string;
        price: number;
        thumbnail: string;
        category: { id: string; name: string; slug: string };
    }[];
    total: number;
};

@Injectable()
export class ProductService {
    constructor(private readonly prisma: PrismaService) {}

    async getProducts(input: get_products_input): Promise<get_products_output> {
        const where: Prisma.ProductWhereInput = {
            ...(input.search
                ? { name: { contains: input.search, mode: 'insensitive' } }
                : {}),
            ...(input.categoryId ? { categoryId: input.categoryId } : {}),
        };

        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                orderBy: { createdAt: input.sort === 'newest' ? 'desc' : 'asc' },
                skip: (input.page - 1) * input.pageSize,
                take: input.pageSize,
                include: {
                    category: { select: { id: true, name: true, slug: true } },
                    images: { where: { isPrimary: true }, take: 1 },
                },
            }),
            this.prisma.product.count({ where }),
        ]);

        return {
            items: products.map((product) => ({
                id: product.id,
                name: product.name,
                price: product.price,
                thumbnail: product.images[0]?.url ?? '',
                category: product.category,
            })),
            total,
        };
    }
}
