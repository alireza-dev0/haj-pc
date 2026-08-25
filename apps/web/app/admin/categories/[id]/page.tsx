import type { Metadata } from 'next';
import CategoryDetailPage from '../_components/CategoryDetailPage';

export const metadata: Metadata = {
    title: 'جزئیات دسته‌بندی',
    description: 'مشاهده اطلاعات دسته‌بندی',
};

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <CategoryDetailPage id={id} />;
}
