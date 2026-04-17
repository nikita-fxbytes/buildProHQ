import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, unknown> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((result) => {
        const isObject = result && typeof result === 'object';
        const data = isObject && 'data' in result ? result.data : result;
        const meta = isObject && 'meta' in result ? result.meta : undefined;
        const message =
          isObject && 'message' in result ? result.message : 'Success';

        return {
          success: true,
          statusCode,
          message,
          data,
          meta,
        };
      }),
    );
  }
}
