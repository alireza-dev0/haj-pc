import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';

export class ValidationException extends AppException {
    constructor(fields: Record<string, string[]>) {
        super('Validation failed', HttpStatus.BAD_REQUEST, fields);
        this.name = 'ValidationException';
    }
}

export default ValidationException;
