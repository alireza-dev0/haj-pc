import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Home() {
    const cookieStore = await cookies();
    const hasAuth =
        cookieStore.has('access_token') || cookieStore.has('refresh_token');

    if (!hasAuth) {
        redirect('/auth/signin');
    }

    redirect('/admin/dashboard');
}
