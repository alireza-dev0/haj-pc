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

        this.logger.error(exception);
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Internal server error',
        });
    }
}
