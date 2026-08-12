import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'INTERNAL_SERVER_ERROR';
    let errors: any = {};

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res: any = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object') {
        message = res.message || exception.message;
        code = res.error || res.code || this.getErrorCode(status);
        errors = res.errors || (Array.isArray(res.message) ? res.message : {});
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      code = 'UNHANDLED_EXCEPTION';
    }

    response.status(status).json({
      message: Array.isArray(message) ? message[0] : message,
      code: typeof code === 'string' ? code.toUpperCase().replace(/\s+/g, '_') : 'ERROR',
      errors: typeof errors === 'object' ? errors : { details: errors },
    });
  }

  private getErrorCode(status: number): string {
    switch (status) {
      case 400:
        return 'BAD_REQUEST';
      case 401:
        return 'UNAUTHORIZED';
      case 403:
        return 'FORBIDDEN';
      case 404:
        return 'NOT_FOUND';
      case 409:
        return 'CONFLICT';
      case 422:
        return 'UNPROCESSABLE_ENTITY';
      default:
        return 'HTTP_ERROR';
    }
  }
}
