import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";
import { MongooseError } from "mongoose";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp(); 
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        
        let status = exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        let errorResponse = exception instanceof HttpException
            ? exception.getResponse()
            : { message: "Internal server error" };

         if (exception instanceof MongooseError) {
            status = HttpStatus.BAD_REQUEST;
            let message = exception.message;
            errorResponse = {
                message,
                error: exception.name
            };
        }

        const responseBody = typeof errorResponse === "string"
            ? { message: errorResponse }
            : (errorResponse as Record<string, any>);

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            ...responseBody,
        });
    }
} 