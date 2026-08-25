import type { Metadata } from 'next';
import EditCategoryPage from '../../_components/EditCategoryPage';

export const metadata: Metadata = {
    title: 'ویرایش دسته‌بندی',
    description: 'ویرایش نام، اسلاگ و توضیحات دسته‌بندی',
};

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <EditCategoryPage id={id} />;
}
