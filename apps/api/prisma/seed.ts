// pnpm --filter api db:seed   (or from apps/api: pnpm db:seed)
// Admin login: admin@hajpc.local / HajPcAdmin123!
// Re-runnable local seed: clears orders/products/categories then inserts demo data; upserts users.

import { randomUUID } from 'crypto';
import { config } from 'dotenv';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, type OrderStatus } from '../src/prisma/generated/client';

if (process.env.NODE_ENV === 'production') {
    config({ path: '.env' });
} else {
    // override so `prisma db seed` (which loads `.env` first) still hits the API's local DB
    config({ path: '.env.development', override: true });
}

const connectionString =
    process.env.DATABASE_URL ?? process.env.DIRECT_URL;

if (!connectionString) {
    throw new Error('DATABASE_URL or DIRECT_URL is required to seed');
}

const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
});

const ADMIN_PASSWORD = 'HajPcAdmin123!';
const USER_PASSWORD = 'User123456';

type SeedCategory = {
    slug: string;
    name: string;
    description: string;
};

type SeedProduct = {
    name: string;
    slug: string;
    categorySlug: string;
    price: number;
    stock: number;
    description: string;
};

const CATEGORIES: SeedCategory[] = [
    {
        slug: 'laptop',
        name: 'لپ‌تاپ',
        description: 'لپ‌تاپ‌های اداری و گیمینگ',
    },
    {
        slug: 'gpu',
        name: 'کارت گرافیک',
        description: 'کارت گرافیک NVIDIA و AMD',
    },
    {
        slug: 'cpu',
        name: 'پردازنده',
        description: 'پردازنده‌های Intel و AMD',
    },
    {
        slug: 'ram',
        name: 'رم',
        description: 'حافظه رم DDR4 و DDR5',
    },
    {
        slug: 'motherboard',
        name: 'مادربرد',
        description: 'مادربردهای Intel و AMD',
    },
    {
        slug: 'storage',
        name: 'ذخیره‌سازی',
        description: 'SSD و هارد دیسک',
    },
    {
        slug: 'case',
        name: 'کیس',
        description: 'کیس کامپیوتر میان‌رده و حرفه‌ای',
    },
    {
        slug: 'monitor',
        name: 'مانیتور',
        description: 'مانیتورهای اداری و گیمینگ',
    },
];

const PRODUCTS: SeedProduct[] = [
    {
        name: 'لپ‌تاپ ASUS TUF Gaming A15',
        slug: 'asus-tuf-a15',
        categorySlug: 'laptop',
        price: 52_000_000,
        stock: 6,
        description: 'لپ‌تاپ گیمینگ با پردازنده Ryzen و کارت RTX سری ۴۰',
    },
    {
        name: 'لپ‌تاپ Lenovo LOQ 15 RTX 4060',
        slug: 'lenovo-loq-15',
        categorySlug: 'laptop',
        price: 48_500_000,
        stock: 3,
        description: 'لپ‌تاپ گیمینگ میان‌رده با نمایشگر ۱۴۴ هرتز',
    },
    {
        name: 'لپ‌تاپ Acer Aspire 5 i7',
        slug: 'acer-aspire-5',
        categorySlug: 'laptop',
        price: 36_000_000,
        stock: 9,
        description: 'لپ‌تاپ دانشجویی و اداری با پردازنده نسل ۱۳',
    },
    {
        name: 'کارت گرافیک ASUS TUF RTX 4070 Super 12GB',
        slug: 'asus-tuf-4070-super',
        categorySlug: 'gpu',
        price: 48_000_000,
        stock: 8,
        description: 'کارت گرافیک نسل ۴۰ مناسب بازی در رزولوشن ۲K',
    },
    {
        name: 'کارت گرافیک MSI RTX 4060 Ti 8GB',
        slug: 'msi-4060-ti',
        categorySlug: 'gpu',
        price: 28_500_000,
        stock: 12,
        description: 'کارت گرافیک محبوب برای بازی ۱۰۸۰p و ۱۴۴۰p',
    },
    {
        name: 'کارت گرافیک Sapphire RX 7800 XT 16GB',
        slug: 'sapphire-7800-xt',
        categorySlug: 'gpu',
        price: 32_000_000,
        stock: 3,
        description: 'کارت AMD با ۱۶ گیگابایت حافظه برای بازی و رندر',
    },
    {
        name: 'پردازنده Intel Core i5-14400F',
        slug: 'i5-14400f',
        categorySlug: 'cpu',
        price: 9_800_000,
        stock: 20,
        description: 'پردازنده ۱۰ هسته‌ای مناسب سیستم گیمینگ اقتصادی',
    },
    {
        name: 'پردازنده Intel Core i7-14700K',
        slug: 'i7-14700k',
        categorySlug: 'cpu',
        price: 18_500_000,
        stock: 7,
        description: 'پردازنده رده‌بالا برای گیمینگ و تولید محتوا',
    },
    {
        name: 'پردازنده AMD Ryzen 7 7700X',
        slug: 'ryzen-7-7700x',
        categorySlug: 'cpu',
        price: 14_200_000,
        stock: 4,
        description: 'هشت هسته Zen 4 با مصرف بهینه',
    },
    {
        name: 'پردازنده AMD Ryzen 5 7600',
        slug: 'ryzen-5-7600',
        categorySlug: 'cpu',
        price: 8_900_000,
        stock: 15,
        description: 'شش هسته مناسب اسمبل اقتصادی AM5',
    },
    {
        name: 'رم Kingston Fury 32GB DDR5 6000',
        slug: 'kingston-fury-32-6000',
        categorySlug: 'ram',
        price: 6_400_000,
        stock: 25,
        description: 'کیت ۳۲ گیگابایت دو کاناله با پروفایل EXPO/XMP',
    },
    {
        name: 'رم Crucial 16GB DDR5 5600',
        slug: 'crucial-16-5600',
        categorySlug: 'ram',
        price: 3_200_000,
        stock: 2,
        description: 'رم اقتصادی ۱۶ گیگابایت برای ارتقای سیستم',
    },
    {
        name: 'رم G.Skill Trident Z5 32GB DDR5 6400',
        slug: 'gskill-trident-z5-32',
        categorySlug: 'ram',
        price: 7_800_000,
        stock: 9,
        description: 'رم گیمینگ با هیت‌سینک و تایمینگ پایین',
    },
    {
        name: 'مادربرد ASUS TUF B760-Plus WiFi',
        slug: 'asus-tuf-b760',
        categorySlug: 'motherboard',
        price: 8_500_000,
        stock: 11,
        description: 'مادربرد Intel نسل ۱۲ تا ۱۴ با وای‌فای داخلی',
    },
    {
        name: 'مادربرد MSI MAG B650 Tomahawk',
        slug: 'msi-b650-tomahawk',
        categorySlug: 'motherboard',
        price: 9_200_000,
        stock: 6,
        description: 'مادربرد AM5 با مدار تغذیه قوی',
    },
    {
        name: 'مادربرد Gigabyte Z790 UD',
        slug: 'gigabyte-z790-ud',
        categorySlug: 'motherboard',
        price: 11_400_000,
        stock: 5,
        description: 'چیپست Z790 برای اورکلاک پردازنده‌های K',
    },
    {
        name: 'SSD Samsung 990 EVO 1TB NVMe',
        slug: 'samsung-990-evo-1tb',
        categorySlug: 'storage',
        price: 4_800_000,
        stock: 30,
        description: 'اس‌اس‌دی NVMe نسل ۴ با دوام مناسب استفاده روزانه',
    },
    {
        name: 'SSD Western Digital Black SN770 2TB',
        slug: 'wd-sn770-2tb',
        categorySlug: 'storage',
        price: 7_500_000,
        stock: 14,
        description: 'اس‌اس‌دی گیمینگ ۲ ترابایت با سرعت خواندن بالا',
    },
    {
        name: 'هارد WD Blue 2TB 7200rpm',
        slug: 'wd-blue-2tb',
        categorySlug: 'storage',
        price: 2_900_000,
        stock: 1,
        description: 'هارد اینترنال برای آرشیو و فضای اضافی',
    },
    {
        name: 'کیس Lian Li Lancool 216',
        slug: 'lian-li-lancool-216',
        categorySlug: 'case',
        price: 6_200_000,
        stock: 8,
        description: 'کیس هوای قوی با پنل توری و فن‌های پیش‌نصب',
    },
    {
        name: 'کیس Deepcool CC560',
        slug: 'deepcool-cc560',
        categorySlug: 'case',
        price: 3_400_000,
        stock: 18,
        description: 'کیس میان‌رده با شیشه کناری',
    },
    {
        name: 'مانیتور LG UltraGear 27 اینچ ۱۶۵ هرتز',
        slug: 'lg-ultragear-27',
        categorySlug: 'monitor',
        price: 12_800_000,
        stock: 10,
        description: 'مانیتور گیمینگ QHD با نرخ نوسازی ۱۶۵ هرتز',
    },
    {
        name: 'مانیتور Samsung Odyssey G5 32 اینچ',
        slug: 'samsung-odyssey-g5-32',
        categorySlug: 'monitor',
        price: 15_600_000,
        stock: 4,
        description: 'مانیتور منحنی ۳۲ اینچ مناسب بازی و دسکتاپ گسترده',
    },
];

const USERS = [
    {
        email: 'admin@hajpc.local',
        name: 'مدیر حاج‌پی‌سی',
        role: 'ADMIN' as const,
        password: ADMIN_PASSWORD,
    },
    {
        email: 'ali.rezaei@hajpc.local',
        name: 'علی رضایی',
        role: 'USER' as const,
        password: USER_PASSWORD,
    },
    {
        email: 'sara.mohammadi@hajpc.local',
        name: 'سارا محمدی',
        role: 'USER' as const,
        password: USER_PASSWORD,
    },
    {
        email: 'reza.karimi@hajpc.local',
        name: 'رضا کریمی',
        role: 'USER' as const,
        password: USER_PASSWORD,
    },
    {
        email: 'neda.abbasi@hajpc.local',
        name: 'ندا عباسی',
        role: 'USER' as const,
        password: USER_PASSWORD,
    },
];

const ORDER_DAYS_AGO = [
    0, 1, 1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 18, 21, 24, 27, 40, 50, 60, 75,
    90, 100, 120, 140, 160, 180, 200, 220, 250, 280, 310, 330, 350, 360,
];

function mulberry32(seed: number) {
    return function next() {
        let t = (seed += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function productImageUrl(slug: string) {
    return `https://placehold.co/800x600/1a1a1a/4ade80.png?text=${encodeURIComponent(slug)}`;
}

function statusForAge(daysAgo: number, random: () => number): OrderStatus {
    if (daysAgo <= 1) {
        return random() < 0.55 ? 'PENDING' : 'PROCESSING';
    }
    if (daysAgo <= 6) {
        return random() < 0.35 ? 'PROCESSING' : 'SHIPPED';
    }
    if (daysAgo <= 27) {
        return random() < 0.25 ? 'SHIPPED' : 'DELIVERED';
    }
    return 'DELIVERED';
}

async function seed() {
    const random = mulberry32(20260825);
    const [adminPasswordHash, userPasswordHash] = await Promise.all([
        bcrypt.hash(ADMIN_PASSWORD, 10),
        bcrypt.hash(USER_PASSWORD, 10),
    ]);

    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();

    const userIds: string[] = [];

    for (const user of USERS) {
        const password =
            user.role === 'ADMIN' ? adminPasswordHash : userPasswordHash;
        const saved = await prisma.user.upsert({
            where: { email: user.email },
            update: {
                name: user.name,
                role: user.role,
                password,
            },
            create: {
                id: randomUUID(),
                email: user.email,
                name: user.name,
                role: user.role,
                password,
            },
        });
        if (user.role === 'USER') {
            userIds.push(saved.id);
        }
    }

    const categoryIds = new Map<string, string>();

    for (const category of CATEGORIES) {
        const saved = await prisma.category.create({
            data: {
                id: randomUUID(),
                name: category.name,
                slug: category.slug,
                description: category.description,
            },
        });
        categoryIds.set(category.slug, saved.id);
    }

    const products: { id: string; price: number }[] = [];

    for (const product of PRODUCTS) {
        const categoryId = categoryIds.get(product.categorySlug);
        if (!categoryId) {
            throw new Error(`Missing category ${product.categorySlug}`);
        }

        const saved = await prisma.product.create({
            data: {
                id: randomUUID(),
                name: product.name,
                categoryId,
                price: product.price,
                stock: product.stock,
                description: product.description,
                images: {
                    create: {
                        id: randomUUID(),
                        url: productImageUrl(product.slug),
                        sortOrder: 0,
                        isPrimary: true,
                    },
                },
            },
        });
        products.push({ id: saved.id, price: saved.price });
    }

    const customerIds = userIds.length > 0 ? userIds : [];
    if (customerIds.length === 0) {
        throw new Error('Seed needs at least one USER account to attach orders');
    }

    for (const daysAgo of ORDER_DAYS_AGO) {
        const createdAt = new Date();
        createdAt.setUTCDate(createdAt.getUTCDate() - daysAgo);
        createdAt.setUTCHours(8 + Math.floor(random() * 10), Math.floor(random() * 60), 0, 0);

        const itemCount = 1 + Math.floor(random() * 3);
        const items: { productId: string; quantity: number; priceAtOrder: number }[] =
            [];
        const used = new Set<string>();

        while (items.length < itemCount) {
            const product = products[Math.floor(random() * products.length)]!;
            if (used.has(product.id)) continue;
            used.add(product.id);
            items.push({
                productId: product.id,
                quantity: 1 + Math.floor(random() * 3),
                priceAtOrder: product.price,
            });
        }

        const totalAmount = items.reduce(
            (sum, item) => sum + item.quantity * item.priceAtOrder,
            0,
        );

        await prisma.order.create({
            data: {
                id: randomUUID(),
                userId: customerIds[Math.floor(random() * customerIds.length)]!,
                status: statusForAge(daysAgo, random),
                totalAmount,
                createdAt,
                updatedAt: createdAt,
                items: {
                    create: items.map((item) => ({
                        id: randomUUID(),
                        productId: item.productId,
                        quantity: item.quantity,
                        priceAtOrder: item.priceAtOrder,
                    })),
                },
            },
        });
    }

    console.log(
        `Seeded ${USERS.length} users, ${CATEGORIES.length} categories, ${PRODUCTS.length} products, ${ORDER_DAYS_AGO.length} orders.`,
    );
    console.log('Admin: admin@hajpc.local / HajPcAdmin123!');
}

seed()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
