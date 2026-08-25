import type { Metadata } from 'next';
import CreateCategoryPage from '../_components/CreateCategoryPage';

export const metadata: Metadata = {
    title: 'افزودن دسته‌بندی',
    description: 'ایجاد دسته‌بندی جدید برای محصولات فروشگاه',
};

export default function Page() {
    return <CreateCategoryPage />;
}
