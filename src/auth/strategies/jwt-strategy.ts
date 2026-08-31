import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'secretKey',
            passReqToCallback: true, // allows access to the raw request inside validate()
        });
    }

    async validate(req: Request, payload: any) {
        // Extract the raw JWT from the Authorization header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            throw new UnauthorizedException('No token provided');
        }

        // Check if token exists in the database (i.e., user hasn't logged out)
        const isValid = await this.authService.isTokenValid(token);
        if (!isValid) {
            throw new UnauthorizedException('Token has been invalidated. Please log in again.');
        }

        return payload;
    }
}