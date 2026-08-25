import { cookies, headers } from 'next/headers';
import { redirect, unauthorized } from 'next/navigation';
import { getSafeCallbackUrl } from '@/lib/callback-url';
import type { UserRole } from '@repo/types';

export type SessionUser = {
    id: string;
    email: string;
    name: string;
    role: UserRole;
};

async function getSessionUser(): Promise<SessionUser | null> {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
        .getAll()
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join('; ');

    if (!cookieHeader) {
        return null;
    }

    const apiUrl = process.env.API_URL;
    if (!apiUrl) {
        return null;
    }

    try {
        const response = await fetch(`${apiUrl}/api/auth/me`, {
            headers: { Cookie: cookieHeader },
            cache: 'no-store',
        });

        if (!response.ok) {
            return null;
        }

        return (await response.json()) as SessionUser;
    } catch {
        return null;
    }
}

export async function requireAdmin(): Promise<SessionUser> {
    const user = await getSessionUser();

    if (!user) {
        const pathname = (await headers()).get('x-pathname');
        const callbackUrl = getSafeCallbackUrl(pathname);
        redirect(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }

    if (user.role !== 'ADMIN') {
        unauthorized();
    }

    return user;
}
