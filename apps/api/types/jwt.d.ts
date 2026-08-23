declare global {
    interface RefreshJwtPayload {
        userId: string;
    }

    interface AccessJwtPayload {
        userId: string;
        email: string;
        role: "USER" | "ADMIN";
    }
}

export {}