'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchFakeProducts } from '../_data/fake-products'
import { useFiltersStore } from '../_stores/useFiltersStore'

export function useProducts() {
    const { sort, search, categoryId, page, pageSize } = useFiltersStore()

    return useQuery({
        queryKey: ['admin-products', { sort, search, categoryId, page, pageSize }],
        queryFn: () =>
            fetchFakeProducts({ sort, search, categoryId, page, pageSize }),
    })
}
