import type { Metadata } from 'next';
import { SignupPage } from './_components/SignupPage';

export const metadata: Metadata = {
    title: 'ثبت‌نام',
    description: 'ساخت حساب کاربری جدید',
};

export default function Page() {
    return <SignupPage />;
}
