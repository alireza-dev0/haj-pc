'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowRightIcon, UserRoundPenIcon } from 'lucide-react';
import { EditUserForm } from '../../_components/EditUserForm';

export default function EditUserPage() {
    const params = useParams<{ id: string }>();
    const id = params.id;

    return (
        <div className="flex flex-col gap-8">
            <header className="w-full flex flex-col gap-3">
                <Link
                    href={`/admin/users/${id}`}
                    className="inline-flex w-fit items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary"
                >
                    <ArrowRightIcon className="size-4" strokeWidth={1.5} />
                    بازگشت به جزئیات
                </Link>
                <div className="flex items-center gap-3">
                    <UserRoundPenIcon
                        className="size-7 text-brand"
                        strokeWidth={1.5}
                    />
                    <h1 className="text-xl font-semibold">ویرایش کاربر</h1>
                </div>
            </header>
            <EditUserForm id={id} />
        </div>
    );
}
