import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import type { Response } from 'express';
import { ZodValidationException } from 'nestjs-zod';
import { ZodError } from 'zod';
import { ValidationException } from '../exceptions/validation.exception';

function zodIssuesToFields(error: ZodError): Record<string, string[]> {
    const fields: Record<string, string[]> = {};

    for (const issue of error.issues) {
        const key = issue.path.length > 0 ? issue.path.join('.') : '_root';
        if (!fields[key]) {
            fields[key] = [];
        }
        fields[key].push(issue.message);
    }

    return fields;
}

@Catch(ZodValidationException)
export class ZodValidationFilter implements ExceptionFilter {
    catch(exception: ZodValidationException, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse<Response>();
        const zodError = exception.getZodError();

        if (!(zodError instanceof ZodError)) {
            return response.status(400).json({
                message: 'Validation failed',
            });
        }

        const ex = new ValidationException(zodIssuesToFields(zodError));
        return response.status(ex.status).json({
            message: ex.message,
            fields: ex.fields,
        });
    }
}
