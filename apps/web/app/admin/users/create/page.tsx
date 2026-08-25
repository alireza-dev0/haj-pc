import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRightIcon, UserPlusIcon } from 'lucide-react';
import { CreateUserForm } from '../_components/CreateUserForm';

export const metadata: Metadata = {
    title: 'افزودن کاربر',
    description: 'ایجاد کاربر جدید',
};

export default function CreateUserPage() {
    return (
        <div className="flex flex-col gap-8">
            <header className="w-full flex flex-col gap-3">
                <Link
                    href="/admin/users"
                    className="inline-flex w-fit items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary"
                >
                    <ArrowRightIcon className="size-4" strokeWidth={1.5} />
                    بازگشت به کاربران
                </Link>
                <div className="flex items-center gap-3">
                    <UserPlusIcon
                        className="size-7 text-brand"
                        strokeWidth={1.5}
                    />
                    <h1 className="text-xl font-semibold">افزودن کاربر</h1>
                </div>
            </header>
            <CreateUserForm />
        </div>
    );
}
