import type { Metadata } from 'next';
import CreateProductPage from '../_components/CreateProductPage';

export const metadata: Metadata = {
    title: 'افزودن محصول',
    description: 'افزودن محصول جدید به فروشگاه',
};

export default function Page() {
    return <CreateProductPage />;
}
