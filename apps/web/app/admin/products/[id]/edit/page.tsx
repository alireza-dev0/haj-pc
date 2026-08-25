import type { Metadata } from 'next';
import EditProductPage from '../../_components/EditProductPage';

export const metadata: Metadata = {
    title: 'ویرایش محصول',
    description: 'ویرایش مشخصات محصول',
};

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <EditProductPage id={id} />;
}
