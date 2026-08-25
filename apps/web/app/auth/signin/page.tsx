import { Suspense } from 'react';
import type { Metadata } from 'next';
import { SigninPage } from './_components/SigninPage';

export const metadata: Metadata = {
    title: 'ورود',
    description: 'ورود به حساب کاربری',
};

export default function Page() {
    return (
        <Suspense>
            <SigninPage />
        </Suspense>
    );
}
