declare global {
    interface RefreshJwtPayload {
        userId: string;
    }

    interface AccessJwtPayload {
        id: string;
        email: string;
        role: UserRole;
        name: string;
    }
}

export {}