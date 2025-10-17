import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const excResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    let message: string | object = 'Internal server error';

    if (typeof excResponse === 'string') {
      message = excResponse;
    } else if (excResponse && typeof excResponse === 'object') {
      // ValidationPipe often returns { message: [...], error: ... }
      // prefer the message field if present, otherwise return the object
      if ('message' in excResponse) {
        message = (excResponse as any).message;
      } else {
        message = excResponse;
      }
    } else if (exception && (exception as any).message) {
      message = (exception as any).message;
    }

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      console.error('Unhandled exception', exception);
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      path: request.url,
      message,
    });
  }
}
