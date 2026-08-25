import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
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

type product_image_input = {
    url: string;
    sortOrder?: number;
    isPrimary?: boolean;
};

type create_product_input = {
    name: string;
    categoryId: string;
    price: number;
    stock: number;
    description?: string;
    images?: product_image_input[];
};

type update_product_input = {
    name?: string;
    categoryId?: string;
    price?: number;
    stock?: number;
    description?: string;
    images?: product_image_input[];
};

type product_detail_output = {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: string;
    category: { id: string; name: string; slug: string };
    images: { id: string; url: string; sortOrder: number; isPrimary: boolean }[];
    createdAt: Date;
    updatedAt: Date;
};

const productDetailInclude = {
    category: { select: { id: true, name: true, slug: true } },
    images: {
        select: { id: true, url: true, sortOrder: true, isPrimary: true },
        orderBy: { sortOrder: 'asc' as const },
    },
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

    async getProductById(id: string): Promise<product_detail_output> {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: productDetailInclude,
        });

        if (!product) {
            throw new NotFoundException('محصول یافت نشد');
        }

        return product;
    }

    async createProduct(input: create_product_input): Promise<product_detail_output> {
        await this.assertCategoryExists(input.categoryId);

        const productId = randomUUID();
        const images = this.mapImages(productId, input.images);

        return this.prisma.product.create({
            data: {
                id: productId,
                name: input.name,
                categoryId: input.categoryId,
                price: input.price,
                stock: input.stock,
                description: input.description ?? '',
                images: images.length ? { create: images } : undefined,
            },
            include: productDetailInclude,
        });
    }

    async updateProduct(
        id: string,
        input: update_product_input,
    ): Promise<product_detail_output> {
        await this.getProductById(id);

        if (input.categoryId) {
            await this.assertCategoryExists(input.categoryId);
        }

        const replaceImages = input.images !== undefined;
        const images = replaceImages ? this.mapImages(id, input.images) : [];

        return this.prisma.$transaction(async (tx) => {
            if (replaceImages) {
                await tx.productImage.deleteMany({ where: { productId: id } });
            }

            return tx.product.update({
                where: { id },
                data: {
                    ...(input.name !== undefined ? { name: input.name } : {}),
                    ...(input.categoryId !== undefined
                        ? { categoryId: input.categoryId }
                        : {}),
                    ...(input.price !== undefined ? { price: input.price } : {}),
                    ...(input.stock !== undefined ? { stock: input.stock } : {}),
                    ...(input.description !== undefined
                        ? { description: input.description }
                        : {}),
                    ...(replaceImages && images.length
                        ? { images: { create: images } }
                        : {}),
                },
                include: productDetailInclude,
            });
        });
    }

    async deleteProduct(id: string): Promise<{ id: string }> {
        await this.getProductById(id);

        await this.prisma.$transaction(async (tx) => {
            await tx.productImage.deleteMany({ where: { productId: id } });
            await tx.product.delete({ where: { id } });
        });

        return { id };
    }

    private async assertCategoryExists(categoryId: string): Promise<void> {
        const category = await this.prisma.category.findUnique({
            where: { id: categoryId },
            select: { id: true },
        });

        if (!category) {
            throw new NotFoundException('دسته‌بندی یافت نشد');
        }
    }

    private mapImages(productId: string, images?: product_image_input[]) {
        if (!images?.length) return [];

        const hasPrimary = images.some((image) => image.isPrimary);

        return images.map((image, index) => ({
            id: randomUUID(),
            productId,
            url: image.url,
            sortOrder: image.sortOrder ?? index,
            isPrimary: hasPrimary ? !!image.isPrimary : index === 0,
        }));
    }
}
