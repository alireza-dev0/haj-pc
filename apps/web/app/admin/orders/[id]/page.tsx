import type { Metadata } from 'next';
import OrderDetailPage from '../_components/OrderDetailPage';

export const metadata: Metadata = {
    title: 'جزئیات سفارش',
    description: 'مشاهده جزئیات سفارش',
};

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <OrderDetailPage id={id} />;
}
