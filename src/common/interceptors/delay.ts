import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { delay, Observable } from "rxjs";

export class Delay implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(delay(3000));
    }
}