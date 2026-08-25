import type { Metadata } from 'next';
import { ProfilePage } from './_components/ProfilePage';

export const metadata: Metadata = {
    title: 'حساب کاربری',
    description: 'ویرایش حساب کاربری',
};

export default function Page() {
    return <ProfilePage />;
}
