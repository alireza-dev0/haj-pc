import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Prisma } from 'app/prisma/generated/client';
import { ValidationException } from '../../common/exceptions/validation.exception';
import { PrismaService } from '../shared/prisma.service';

const PERSIAN_TO_LATIN: Record<string, string> = {
    ا: 'a',
    آ: 'a',
    أ: 'a',
    إ: 'e',
    ب: 'b',
    پ: 'p',
    ت: 't',
    ث: 's',
    ج: 'j',
    چ: 'ch',
    ح: 'h',
    خ: 'kh',
    د: 'd',
    ذ: 'z',
    ر: 'r',
    ز: 'z',
    ژ: 'zh',
    س: 's',
    ش: 'sh',
    ص: 's',
    ض: 'z',
    ط: 't',
    ظ: 'z',
    ع: 'a',
    غ: 'gh',
    ف: 'f',
    ق: 'gh',
    ک: 'k',
    ك: 'k',
    گ: 'g',
    ل: 'l',
    م: 'm',
    ن: 'n',
    و: 'v',
    ه: 'h',
    ی: 'y',
    ي: 'y',
    ى: 'y',
    ء: '',
    ئ: 'y',
    ؤ: 'v',
    ة: 'h',
};

type category_record = {
    id: string;
    name: string;
    slug: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    _count: { products: number };
};

type category_response = {
    id: string;
    name: string;
    slug: string;
    description: string;
    productCount: number;
    createdAt: string;
    updatedAt: string;
};

type create_category_input = {
    name: string;
    slug?: string;
    description?: string;
};

type update_category_input = {
    name?: string;
    slug?: string;
    description?: string;
};

@Injectable()
export class CategoryService {
    constructor(private readonly prisma: PrismaService) {}

    async getCategories(): Promise<category_response[]> {
        const categories = await this.prisma.category.findMany({
            include: { _count: { select: { products: true } } },
            orderBy: { name: 'asc' },
        });

        return categories.map((category) => this.toResponse(category));
    }

    async getCategoryById(id: string): Promise<category_response> {
        return this.findOrThrow(id);
    }

    async createCategory(input: create_category_input): Promise<category_response> {
        const slug = await this.resolveSlug(input.name, input.slug);

        try {
            const category = await this.prisma.category.create({
                data: {
                    id: randomUUID(),
                    name: input.name,
                    slug,
                    description: input.description ?? '',
                },
                include: { _count: { select: { products: true } } },
            });

            return this.toResponse(category);
        } catch (error) {
            this.rethrowSlugConflict(error);
        }
    }

    async updateCategory(
        id: string,
        input: update_category_input,
    ): Promise<category_response> {
        const existing = await this.findOrThrow(id);
        const data: Prisma.CategoryUpdateInput = {};

        if (input.name !== undefined) {
            data.name = input.name;
        }

        if (input.description !== undefined) {
            data.description = input.description;
        }

        if (input.slug?.trim()) {
            data.slug = await this.resolveSlug(
                input.name ?? existing.name,
                input.slug,
                id,
            );
        }

        try {
            const category = await this.prisma.category.update({
                where: { id },
                data,
                include: { _count: { select: { products: true } } },
            });

            return this.toResponse(category);
        } catch (error) {
            this.rethrowSlugConflict(error);
        }
    }

    async deleteCategory(id: string): Promise<{ ok: true }> {
        const category = await this.findOrThrow(id);

        if (category.productCount > 0) {
            throw new BadRequestException(
                'این دسته‌بندی دارای محصول است و امکان حذف آن وجود ندارد',
            );
        }

        await this.prisma.category.delete({ where: { id } });
        return { ok: true };
    }

    private async findOrThrow(id: string): Promise<category_response> {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: { _count: { select: { products: true } } },
        });

        if (!category) {
            throw new NotFoundException('دسته‌بندی یافت نشد');
        }

        return this.toResponse(category);
    }

    private toResponse(category: category_record): category_response {
        return {
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description,
            productCount: category._count.products,
            createdAt: category.createdAt.toISOString(),
            updatedAt: category.updatedAt.toISOString(),
        };
    }

    private async resolveSlug(
        name: string,
        slug: string | undefined,
        excludeId?: string,
    ): Promise<string> {
        const trimmed = slug?.trim();
        const explicit = Boolean(trimmed);
        const base =
            this.slugify(trimmed ?? '') ||
            this.slugify(name) ||
            `cat-${randomUUID().slice(0, 8)}`;

        if (explicit) {
            const taken = await this.prisma.category.findUnique({
                where: { slug: base },
            });
            if (taken && taken.id !== excludeId) {
                throw new ValidationException({
                    slug: ['این اسلاگ قبلاً ثبت شده است'],
                });
            }
            return base;
        }

        return this.ensureUniqueSlug(base, excludeId);
    }

    private async ensureUniqueSlug(
        base: string,
        excludeId?: string,
    ): Promise<string> {
        let slug = base;
        let suffix = 2;

        while (true) {
            const taken = await this.prisma.category.findUnique({
                where: { slug },
            });
            if (!taken || taken.id === excludeId) {
                return slug;
            }
            slug = `${base}-${suffix}`;
            suffix += 1;
        }
    }

    private slugify(value: string): string {
        const transliterated = value
            .trim()
            .toLowerCase()
            .split('')
            .map((char) => PERSIAN_TO_LATIN[char] ?? char)
            .join('');

        return transliterated
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .replace(/-{2,}/g, '-');
    }

    private rethrowSlugConflict(error: unknown): never {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002'
        ) {
            throw new ValidationException({
                slug: ['این اسلاگ قبلاً ثبت شده است'],
            });
        }
        throw error;
    }
}
