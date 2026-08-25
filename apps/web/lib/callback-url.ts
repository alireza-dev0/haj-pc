const DEFAULT_CALLBACK_URL = '/admin/dashboard';

export function getSafeCallbackUrl(raw: string | null | undefined): string {
    if (!raw) {
        return DEFAULT_CALLBACK_URL;
    }

    if (!raw.startsWith('/') || raw.startsWith('//') || raw.startsWith('/\\')) {
        return DEFAULT_CALLBACK_URL;
    }

    if (raw.startsWith('/auth/')) {
        return DEFAULT_CALLBACK_URL;
    }

    return raw;
}
