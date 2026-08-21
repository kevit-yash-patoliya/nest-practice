import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService  {
constructor(@Inject(forwardRef(() => AuthService)) private authService: AuthService) {}

  getUserProfile(userId: string) {
    const isValid = this.authService.validateSession(userId);
    return { userId, isValid };
  }
  findById(userId: string) {
    return { userId, isValid: true };
  }
}
