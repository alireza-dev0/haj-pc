'use client';

import React from 'react';
import ProductCard, { ProductCardSkeleton } from '../_components/ProductCard';
import { useProducts } from '../_hooks/useProducts';
import { useFiltersStore } from '../_stores/useFiltersStore';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';

function getPageNumbers(currentPage: number, totalPages: number) {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages = new Set<number>([1, totalPages, currentPage]);

    if (currentPage > 1) pages.add(currentPage - 1);
    if (currentPage < totalPages) pages.add(currentPage + 1);

    return Array.from(pages).sort((a, b) => a - b);
}

export default function ProductsSection() {
    const { data, isLoading, isError } = useProducts();
    const { page, pageSize, setPage } = useFiltersStore();

    const total = data?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const pageNumbers = getPageNumbers(page, totalPages);

    return (
        <div className="@container w-full flex flex-col gap-6">
            <div className="w-full grid grid-cols-1 gap-x-2 gap-y-3 @[600px]:grid-cols-2 @[900px]:grid-cols-3 @[1200px]:grid-cols-4 @[1500px]:grid-cols-5 @[1800px]:grid-cols-6">
                {isLoading &&
                    Array.from({ length: 10 }).map((_, index) => (
                        <ProductCardSkeleton key={index} />
                    ))}

                {isError && (
                    <p className="col-span-full py-10 text-center text-error">
                        خطا در دریافت محصولات
                    </p>
                )}

                {!isLoading && !isError && data?.items.length === 0 && (
                    <p className="col-span-full py-10 text-center text-text-secondary">
                        محصولی یافت نشد
                    </p>
                )}

                {!isLoading &&
                    !isError &&
                    data?.items.map((product) => (
                        <ProductCard
                            className="w-full grow shrink"
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            price={product.price}
                            thumbnail={product.thumbnail}
                            category={product.category}
                        />
                    ))}
            </div>

            {!isLoading && !isError && total > pageSize && (
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                text="قبلی"
                                className={
                                    page <= 1
                                        ? 'pointer-events-none opacity-50'
                                        : ''
                                }
                                onClick={(event) => {
                                    event.preventDefault();
                                    if (page > 1) setPage(page - 1);
                                }}
                            />
                        </PaginationItem>

                        {pageNumbers.map((pageNumber, index) => {
                            const prevPage = pageNumbers[index - 1];
                            const showEllipsis =
                                prevPage !== undefined &&
                                pageNumber - prevPage > 1;

                            return (
                                <React.Fragment key={pageNumber}>
                                    {showEllipsis && (
                                        <PaginationItem>
                                            <span className="px-2 text-text-muted">
                                                ...
                                            </span>
                                        </PaginationItem>
                                    )}
                                    <PaginationItem>
                                        <PaginationLink
                                            href="#"
                                            isActive={pageNumber === page}
                                            onClick={(event) => {
                                                event.preventDefault();
                                                setPage(pageNumber);
                                            }}
                                        >
                                            {pageNumber}
                                        </PaginationLink>
                                    </PaginationItem>
                                </React.Fragment>
                            );
                        })}

                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                text="بعدی"
                                className={
                                    page >= totalPages
                                        ? 'pointer-events-none opacity-50'
                                        : ''
                                }
                                onClick={(event) => {
                                    event.preventDefault();
                                    if (page < totalPages) setPage(page + 1);
                                }}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}
