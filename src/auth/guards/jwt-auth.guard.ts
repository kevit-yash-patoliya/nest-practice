import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or malformed Authorization header');
    }
    const token = authHeader.split(' ')[1];

    let payload: any;
    try {
      payload = this.jwtService.verify(token, { secret: 'secretKey' });
    } catch (err) {
      throw new UnauthorizedException(`Invalid or expired token: ${err.message}`);
    }

    const isValid = await this.authService.isTokenValid(token);
    if (!isValid) {
      throw new UnauthorizedException('Token has been invalidated. Please log in again.');
    }

    request.user = payload;

    return true;
  }
}
