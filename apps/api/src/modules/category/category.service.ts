import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';

type get_categories_output = { id: string; name: string; slug: string }[];

@Injectable()
export class CategoryService {
    constructor(private readonly prisma: PrismaService) {}

    async getCategories(): Promise<get_categories_output> {
        return this.prisma.category.findMany({
            select: { id: true, name: true, slug: true },
            orderBy: { name: 'asc' },
        });
    }
}
