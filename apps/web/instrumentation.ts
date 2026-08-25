const PING_INTERVAL_MS = 13 * 60 * 1000;

async function pingBackend() {
    const apiUrl = process.env.API_URL;
    if (!apiUrl) {
        return;
    }

    try {
        await fetch(`${apiUrl}/api/health`, { cache: 'no-store' });
    } catch {
        // Backend may be sleeping; the next tick will retry.
    }
}

export async function register() {
    if (process.env.NEXT_RUNTIME !== 'nodejs') {
        return;
    }

    await pingBackend();
    setInterval(() => {
        void pingBackend();
    }, PING_INTERVAL_MS);
}
