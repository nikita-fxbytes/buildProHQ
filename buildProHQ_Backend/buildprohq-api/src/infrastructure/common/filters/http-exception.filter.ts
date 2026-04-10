import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { MESSAGES } from '../constants/messages';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request & { url: string; method: string }>();
    const status = this.resolveStatus(exception);
    let message: string = this.getDefaultMessage(status);
    let code = 'INTERNAL_SERVER_ERROR';
    let details: string[] = [];

    if (exception instanceof HttpException) {
      const payload = exception.getResponse();
      const statusName = HttpStatus[status] || 'UNKNOWN_ERROR';
      code = statusName.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase();

      if (typeof payload === 'string') {
        message = payload;
      } else if (typeof payload === 'object' && payload !== null) {
        const payloadObj = payload as { message?: unknown };
        if (Array.isArray(payloadObj.message)) {
          details = payloadObj.message.map((item) => String(item));
          message = MESSAGES.COMMON.VALIDATION_FAILED;
          code = 'VALIDATION_ERROR';
        } else if (
          typeof payloadObj.message === 'string' &&
          payloadObj.message.trim().length > 0
        ) {
          message = payloadObj.message;
        }
      }
    } else if (exception instanceof QueryFailedError) {
      code = 'DATABASE_ERROR';
      message = MESSAGES.COMMON.DATABASE_ERROR;
    }

    this.logger.error(`${request.method} ${request.url}`, exception as Error);

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      error: {
        code,
        details,
      },
    });

    // 401/403/404 are common and not actionable as "errors" in logs.
    // Only log stacktraces for unexpected failures.
    if (status >= 500) {
      this.logger.error(`${request.method} ${request.url}`, exception as Error);
    } else if (status === HttpStatus.UNAUTHORIZED || status === HttpStatus.FORBIDDEN) {
      this.logger.warn(`${request.method} ${request.url} -> ${status} ${message}`);
    } else {
      this.logger.log(`${request.method} ${request.url} -> ${status} ${message}`);
    }
  }

  private resolveStatus(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }
    if (exception instanceof QueryFailedError) {
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getDefaultMessage(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return MESSAGES.COMMON.BAD_REQUEST;
      case HttpStatus.UNAUTHORIZED:
        return MESSAGES.COMMON.UNAUTHORIZED;
      case HttpStatus.FORBIDDEN:
        return MESSAGES.COMMON.FORBIDDEN;
      case HttpStatus.NOT_FOUND:
        return MESSAGES.COMMON.NOT_FOUND;
      case HttpStatus.CONFLICT:
        return MESSAGES.COMMON.CONFLICT;
      default:
        return MESSAGES.COMMON.INTERNAL_SERVER_ERROR;
    }
  }
}

