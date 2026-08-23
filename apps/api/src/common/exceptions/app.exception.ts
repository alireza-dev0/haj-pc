export class AppException extends Error {
    constructor(
        public readonly message: string,
        public readonly status: number,
        public readonly fields?: Record<string, string[]>,
    ) {
        super(message);
        this.name = 'AppException';
    }
}

export default AppException;
