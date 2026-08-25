import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_COOKIE_NAMES = ['access_token', 'refresh_token'] as const;

function hasAuthCookie(request: NextRequest) {
    return AUTH_COOKIE_NAMES.some((name) => request.cookies.has(name));
}

export function proxy(request: NextRequest) {
    if (!hasAuthCookie(request)) {
        const signinUrl = new URL('/auth/signin', request.url);
        const callbackUrl = `${request.nextUrl.pathname}${request.nextUrl.search}`;
        signinUrl.searchParams.set('callbackUrl', callbackUrl);
        return NextResponse.redirect(signinUrl);
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-pathname', request.nextUrl.pathname);

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

export const config = {
    matcher: ['/admin', '/admin/:path*'],
};
