import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";

@Injectable()
export class TestingInterceptors implements NestInterceptor{
    intercept(context:ExecutionContext,next:CallHandler){
        console.log("Testing Interceptors")
        // console.log(context,"context")
        // console.log(next,"next")
        return next.handle();
    }
}
