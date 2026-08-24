import { ApiProperty } from '@nestjs/swagger';

// =============================== Response DTO ===============================

// maded with @nestjs/swagger with example and description
export class CategoryDto_Response {
    @ApiProperty({ example: 'cat-1', description: 'شناسه دسته‌بندی' })
    id!: string;

    @ApiProperty({ example: 'پردازنده', description: 'نام دسته‌بندی' })
    name!: string;

    @ApiProperty({ example: 'cpu', description: 'اسلاگ دسته‌بندی' })
    slug!: string;
}
