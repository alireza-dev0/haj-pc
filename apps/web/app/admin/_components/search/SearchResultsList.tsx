'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import {
    FolderTreeIcon,
    PackageIcon,
    ShoppingCartIcon,
    UsersIcon,
} from 'lucide-react';
import type {
    ISearchCategory,
    ISearchOrder,
    ISearchProduct,
    ISearchUser,
} from '@repo/types';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { orderStatusLabel } from '../../orders/_lib/status-labels';
import { roleLabel } from '../../users/_lib/role-labels';
import { formatPrice, shortOrderId } from '../../orders/_lib/format';
import {
    SEARCH_MIN_QUERY_LENGTH,
    hasSearchResults,
    useGlobalSearch,
} from '../../_hooks/useGlobalSearch';

type SearchResultsListProps = {
    query: string;
    onResultClick?: () => void;
    className?: string;
};

export function SearchResultsList({
    query,
    onResultClick,
    className,
}: SearchResultsListProps) {
    const trimmed = query.trim();
    const { data, isError, isFetching, isDebouncing } = useGlobalSearch(query);
    const isLoading =
        trimmed.length >= SEARCH_MIN_QUERY_LENGTH &&
        (isFetching || isDebouncing);

    if (trimmed.length < SEARCH_MIN_QUERY_LENGTH) {
        return (
            <p className="px-3 py-6 text-center text-sm leading-relaxed text-text-secondary">
                نام محصول، کاربر، سفارش یا دسته‌بندی را جستجو کنید
            </p>
        );
    }

    if (isLoading && !data) {
        return (
            <div className="flex items-center justify-center gap-2 px-3 py-8 text-sm text-text-secondary">
                <Spinner className="size-4" />
                <span>در حال جستجو...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <p className="px-3 py-6 text-center text-sm text-error">
                خطا در جستجو
            </p>
        );
    }

    if (!hasSearchResults(data)) {
        return (
            <p className="px-3 py-6 text-center text-sm leading-relaxed text-text-secondary">
                نتیجه‌ای یافت نشد
            </p>
        );
    }

    return (
        <div className={cn('flex flex-col gap-3', className)}>
            {isLoading && (
                <div className="flex items-center justify-center gap-2 text-xs text-text-muted">
                    <Spinner className="size-3.5" />
                    <span>در حال جستجو...</span>
                </div>
            )}

            {data && data.products.length > 0 && (
                <SearchGroup label="محصولات">
                    {data.products.map((product) => (
                        <ProductResult
                            key={product.id}
                            product={product}
                            onResultClick={onResultClick}
                        />
                    ))}
                </SearchGroup>
            )}

            {data && data.users.length > 0 && (
                <SearchGroup label="کاربران">
                    {data.users.map((user) => (
                        <UserResult
                            key={user.id}
                            user={user}
                            onResultClick={onResultClick}
                        />
                    ))}
                </SearchGroup>
            )}

            {data && data.orders.length > 0 && (
                <SearchGroup label="سفارشات">
                    {data.orders.map((order) => (
                        <OrderResult
                            key={order.id}
                            order={order}
                            onResultClick={onResultClick}
                        />
                    ))}
                </SearchGroup>
            )}

            {data && data.categories.length > 0 && (
                <SearchGroup label="دسته‌بندی‌ها">
                    {data.categories.map((category) => (
                        <CategoryResult
                            key={category.id}
                            category={category}
                            onResultClick={onResultClick}
                        />
                    ))}
                </SearchGroup>
            )}
        </div>
    );
}

function SearchGroup({
    label,
    children,
}: {
    label: string;
    children: ReactNode;
}) {
    return (
        <section className="flex flex-col gap-0.5">
            <h3 className="px-2 py-1 text-xs font-medium text-text-muted">
                {label}
            </h3>
            <div className="flex flex-col">{children}</div>
        </section>
    );
}

function ResultLink({
    href,
    onResultClick,
    children,
}: {
    href: string;
    onResultClick?: () => void;
    children: ReactNode;
}) {
    return (
        <Link
            href={href}
            onClick={onResultClick}
            className="flex items-center gap-3 rounded-md px-2 py-2 text-start transition-colors duration-150 ease-out hover:bg-card"
        >
            {children}
        </Link>
    );
}

function ResultText({
    title,
    subtitle,
}: {
    title: ReactNode;
    subtitle?: ReactNode;
}) {
    return (
        <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-text-primary">
                {title}
            </span>
            {subtitle ? (
                <span className="mt-0.5 block truncate text-xs text-text-secondary">
                    {subtitle}
                </span>
            ) : null}
        </span>
    );
}

function ProductResult({
    product,
    onResultClick,
}: {
    product: ISearchProduct;
    onResultClick?: () => void;
}) {
    return (
        <ResultLink
            href={`/admin/products/${product.id}`}
            onResultClick={onResultClick}
        >
            <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-card">
                {product.thumbnail ? (
                    // Thumbnail URLs may be off-site.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={product.thumbnail}
                        alt=""
                        className="size-full object-cover object-center"
                    />
                ) : (
                    <PackageIcon
                        className="size-4 text-text-muted"
                        strokeWidth={1.5}
                    />
                )}
            </span>
            <ResultText title={product.name} subtitle="محصول" />
        </ResultLink>
    );
}

function UserResult({
    user,
    onResultClick,
}: {
    user: ISearchUser;
    onResultClick?: () => void;
}) {
    return (
        <ResultLink
            href={`/admin/users/${user.id}`}
            onResultClick={onResultClick}
        >
            <ResultIcon>
                <UsersIcon className="size-4" strokeWidth={1.5} />
            </ResultIcon>
            <ResultText
                title={user.name}
                subtitle={
                    <>
                        <span dir="ltr">{user.email}</span>
                        {' · '}
                        {roleLabel[user.role]}
                    </>
                }
            />
        </ResultLink>
    );
}

function OrderResult({
    order,
    onResultClick,
}: {
    order: ISearchOrder;
    onResultClick?: () => void;
}) {
    const customer = order.user?.name ?? order.user?.email;

    return (
        <ResultLink
            href={`/admin/orders/${order.id}`}
            onResultClick={onResultClick}
        >
            <ResultIcon>
                <ShoppingCartIcon className="size-4" strokeWidth={1.5} />
            </ResultIcon>
            <ResultText
                title={
                    <span dir="ltr" className="tabular-nums">
                        #{shortOrderId(order.id)}
                    </span>
                }
                subtitle={
                    <>
                        {customer ? `${customer} · ` : null}
                        {orderStatusLabel[order.status]}
                        {' · '}
                        <span dir="ltr" className="tabular-nums">
                            {formatPrice(order.totalAmount)}
                        </span>{' '}
                        تومان
                    </>
                }
            />
        </ResultLink>
    );
}

function CategoryResult({
    category,
    onResultClick,
}: {
    category: ISearchCategory;
    onResultClick?: () => void;
}) {
    return (
        <ResultLink
            href={`/admin/categories/${category.id}`}
            onResultClick={onResultClick}
        >
            <ResultIcon>
                <FolderTreeIcon className="size-4" strokeWidth={1.5} />
            </ResultIcon>
            <ResultText
                title={category.name}
                subtitle={
                    <span dir="ltr" className="tabular-nums">
                        {category.slug}
                    </span>
                }
            />
        </ResultLink>
    );
}

function ResultIcon({ children }: { children: ReactNode }) {
    return (
        <span className="flex size-9 shrink-0 items-center justify-center rounded-sm bg-card text-text-secondary">
            {children}
        </span>
    );
}
