import { ICategory, IProduct } from '@repo/types';
import { ProductSort } from '../_stores/useFiltersStore';

export type FakeProduct = Pick<
    IProduct,
    'id' | 'name' | 'price' | 'createdAt'
> & {
    category: Pick<ICategory, 'id' | 'slug' | 'name'>;
};

export const fakeCategories: Pick<ICategory, 'id' | 'name' | 'slug'>[] = [
    { id: 'cat-1', name: 'پردازنده', slug: 'cpu' },
    { id: 'cat-2', name: 'مادربرد', slug: 'motherboard' },
    { id: 'cat-3', name: 'رم', slug: 'ram' },
    { id: 'cat-4', name: 'کارت گرافیک', slug: 'gpu' },
    { id: 'cat-5', name: 'ذخیره‌سازی', slug: 'storage' },
];

const productNames = [
    'پردازنده Intel Core i5-13400F',
    'پردازنده Intel Core i7-13700K',
    'پردازنده AMD Ryzen 5 7600X',
    'پردازنده AMD Ryzen 7 7800X3D',
    'مادربرد ASUS PRIME B760-PLUS',
    'مادربرد MSI MAG B650 TOMAHAWK',
    'مادربرد Gigabyte Z790 AORUS ELITE',
    'رم Kingston Fury 16GB DDR5',
    'رم Corsair Vengeance 32GB DDR5',
    'رم G.Skill Trident Z5 16GB',
    'کارت گرافیک RTX 4060 Ti',
    'کارت گرافیک RTX 4070 Super',
    'کارت گرافیک RX 7800 XT',
    'کارت گرافیک RTX 4080 Super',
    'SSD Samsung 990 Pro 1TB',
    'SSD WD Black SN850X 2TB',
    'هارد دیسک Seagate Barracuda 2TB',
    'پردازنده Intel Core i9-14900K',
    'پردازنده AMD Ryzen 9 7950X',
    'مادربرد ASUS ROG STRIX X670E',
    'رم TeamGroup T-Force 32GB DDR5',
    'کارت گرافیک RTX 4090',
    'SSD Crucial P5 Plus 1TB',
    'پردازنده Intel Core i3-13100F',
    'مادربرد ASRock B660M Pro RS',
    'رم ADATA XPG Lancer 16GB',
    'کارت گرافیک GTX 1660 Super',
    'SSD Kingston NV2 500GB',
    'پردازنده AMD Ryzen 5 5600',
    'مادربرد MSI B550M PRO-VDH',
    'رم Corsair Vengeance LPX 16GB DDR4',
    'کارت گرافیک RX 6600',
    'SSD Samsung 870 EVO 1TB',
    'پردازنده Intel Core i5-12400F',
    'مادربرد Gigabyte B760M DS3H',
    'رم Kingston Fury Beast 32GB',
    'کارت گرافیک RTX 3060',
    'SSD WD Blue SN580 1TB',
];

export const fakeProducts: FakeProduct[] = productNames.map((name, index) => {
    const category = fakeCategories[index % fakeCategories.length]!;
    const daysAgo = productNames.length - index;

    return {
        id: `product-${index + 1}`,
        name,
        price: 1_500_000 + index * 250_000,
        category,
        createdAt: new Date(Date.now() - daysAgo * 86_400_000).toISOString(),
    };
});

export type FetchFakeProductsParams = {
    sort: ProductSort;
    search: string;
    categoryId: string | null;
    page: number;
    pageSize: number;
};

export type FetchFakeProductsResult = {
    items: FakeProduct[];
    total: number;
};

export async function fetchFakeProducts({
    sort,
    search,
    categoryId,
    page,
    pageSize,
}: FetchFakeProductsParams): Promise<FetchFakeProductsResult> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    let result = [...fakeProducts];

    if (search.trim()) {
        const query = search.trim().toLowerCase();
        result = result.filter((product) =>
            product.name.toLowerCase().includes(query),
        );
    }

    if (categoryId) {
        result = result.filter((product) => product.category.id === categoryId);
    }

    result.sort((a, b) => {
        const aTime = new Date(a.createdAt).getTime();
        const bTime = new Date(b.createdAt).getTime();
        return sort === 'newest' ? bTime - aTime : aTime - bTime;
    });

    const total = result.length;
    const start = (page - 1) * pageSize;
    const items = result.slice(start, start + pageSize);

    return { items, total };
}
