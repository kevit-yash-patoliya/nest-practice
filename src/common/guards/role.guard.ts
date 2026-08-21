import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import chalk from "chalk";

@Injectable()
export class RoleGuard implements CanActivate{
    constructor(private reflector: Reflector){}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const roles = this.reflector.getAllAndMerge<string[]>('roles', [context.getHandler(),context.getClass()]);
        console.log(chalk.blue("Roles from decorator", roles))
        if(!roles){
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        return true;
    }
}