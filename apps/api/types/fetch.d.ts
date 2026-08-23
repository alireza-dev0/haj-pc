declare global {
    interface Request {
        cookies: Record<string, string>;

        user? : AccessJwtPayload;

        refresh?: {
            payload: RefreshJwtPayload;
        };
    }
}

export {}