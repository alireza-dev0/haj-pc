import type { Metadata } from 'next';
import ProductDetailPage from '../_components/ProductDetailPage';

export const metadata: Metadata = {
    title: 'جزئیات محصول',
    description: 'مشاهده جزئیات محصول',
};

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <ProductDetailPage id={id} />;
}
