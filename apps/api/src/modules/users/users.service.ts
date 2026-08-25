import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { Prisma, UserRole } from 'app/prisma/generated/client';
import { PrismaService } from '../shared/prisma.service';

const userPublicSelect = {
    id: true,
    email: true,
    name: true,
    role: true,
    createdAt: true,
    updatedAt: true,
} satisfies Prisma.UserSelect;

type public_user = {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
};

type get_users_input = {
    q: string;
    role?: UserRole;
    page: number;
    limit: number;
};

type get_users_output = {
    items: public_user[];
    total: number;
    page: number;
    limit: number;
};

type create_user_input = {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
};

type update_user_input = {
    name?: string;
    email?: string;
    password?: string;
    role?: UserRole;
};

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async getUsers(input: get_users_input): Promise<get_users_output> {
        const where: Prisma.UserWhereInput = {
            ...(input.q
                ? {
                      OR: [
                          { name: { contains: input.q, mode: 'insensitive' } },
                          { email: { contains: input.q, mode: 'insensitive' } },
                      ],
                  }
                : {}),
            ...(input.role ? { role: input.role } : {}),
        };

        const [items, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                select: userPublicSelect,
                orderBy: { createdAt: 'desc' },
                skip: (input.page - 1) * input.limit,
                take: input.limit,
            }),
            this.prisma.user.count({ where }),
        ]);

        return {
            items,
            total,
            page: input.page,
            limit: input.limit,
        };
    }

    async getUser(id: string): Promise<public_user> {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: userPublicSelect,
        });

        if (!user) {
            throw new NotFoundException('کاربر یافت نشد');
        }

        return user;
    }

    async createUser(input: create_user_input): Promise<public_user> {
        const existing = await this.prisma.user.findUnique({
            where: { email: input.email },
        });

        if (existing) {
            throw new ConflictException('این ایمیل قبلاً ثبت شده است');
        }

        const password = await bcrypt.hash(input.password, 10);

        return this.prisma.user.create({
            data: {
                id: randomUUID(),
                email: input.email,
                password,
                name: input.name,
                role: input.role ?? 'USER',
            },
            select: userPublicSelect,
        });
    }

    async updateUser(id: string, input: update_user_input): Promise<public_user> {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: { id: true, email: true },
        });

        if (!user) {
            throw new NotFoundException('کاربر یافت نشد');
        }

        if (input.email && input.email !== user.email) {
            const existing = await this.prisma.user.findUnique({
                where: { email: input.email },
            });

            if (existing) {
                throw new ConflictException('این ایمیل قبلاً ثبت شده است');
            }
        }

        const data: Prisma.UserUpdateInput = {
            ...(input.name !== undefined ? { name: input.name } : {}),
            ...(input.email !== undefined ? { email: input.email } : {}),
            ...(input.role !== undefined ? { role: input.role } : {}),
        };

        if (input.password) {
            data.password = await bcrypt.hash(input.password, 10);
        }

        return this.prisma.user.update({
            where: { id },
            data,
            select: userPublicSelect,
        });
    }

    async deleteUser(id: string, currentUserId: string): Promise<{ ok: true }> {
        if (id === currentUserId) {
            throw new BadRequestException('نمی‌توانید حساب خود را حذف کنید');
        }

        const user = await this.prisma.user.findUnique({
            where: { id },
            select: { id: true, _count: { select: { orders: true } } },
        });

        if (!user) {
            throw new NotFoundException('کاربر یافت نشد');
        }

        if (user._count.orders > 0) {
            throw new BadRequestException(
                'این کاربر دارای سفارش است و قابل حذف نیست',
            );
        }

        await this.prisma.user.delete({ where: { id } });

        return { ok: true };
    }
}
