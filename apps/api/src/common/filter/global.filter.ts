import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import { AppException } from '../exceptions/app.exception';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse<Response>();

        if (exception instanceof AppException) {
            return response.status(exception.status).json({
                message: exception.message,
                fields: exception.fields,
            });
        }

        if (exception instanceof HttpException) {
            return response.status(exception.getStatus()).json({
                message: exception.message,
            });
        }

        if (isMulterError(exception)) {
            const message =
                exception.code === 'LIMIT_FILE_SIZE'
                    ? 'حجم تصویر نباید بیشتر از ۵ مگابایت باشد'
                    : 'بارگذاری فایل نامعتبر است';
            return response.status(HttpStatus.BAD_REQUEST).json({ message });
        }

        this.logger.error(exception);
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Internal server error',
        });
    }
}

function isMulterError(
    exception: unknown,
): exception is { code: string; name: string } {
    return (
        typeof exception === 'object' &&
        exception !== null &&
        (exception as { name?: string }).name === 'MulterError' &&
        typeof (exception as { code?: unknown }).code === 'string'
    );
}
