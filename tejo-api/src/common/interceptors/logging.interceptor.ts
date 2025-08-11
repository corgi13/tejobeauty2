import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, ip, userAgent } = request;
    const user = (request as any).user;
    const userId = user?.id || 'anonymous';

    const startTime = Date.now();

    this.logger.log(
      `🚀 ${method} ${url} - User: ${userId} - IP: ${ip} - UA: ${userAgent}`,
    );

    return next.handle().pipe(
      tap((data) => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        const statusCode = response.statusCode;

        this.logger.log(
          `✅ ${method} ${url} - Status: ${statusCode} - Duration: ${duration}ms - User: ${userId}`,
        );

        // Log slow requests
        if (duration > 1000) {
          this.logger.warn(
            `🐌 Slow request detected: ${method} ${url} took ${duration}ms`,
          );
        }
      }),
      catchError((error) => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        const statusCode = error.status || 500;

        this.logger.error(
          `❌ ${method} ${url} - Status: ${statusCode} - Duration: ${duration}ms - User: ${userId} - Error: ${error.message}`,
          error.stack,
        );

        throw error;
      }),
    );
  }
}