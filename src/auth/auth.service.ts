import { forwardRef, HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import mongoose from 'mongoose';
import { AuthRepo } from './auth.repo';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private repo: AuthRepo) {}

  validateSession(userId: string) {
    const user = this.repo.findByUsername(userId);
    return !!user;
  }

  async register(registerDto: RegisterDto) {
    const user = await this.repo.create(registerDto);
    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.repo.findByUsername(loginDto.username);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  // ─── Token Management ─────────────────────────────────────────────────

  async storeToken(userId: mongoose.Types.ObjectId, token: string): Promise<void> {
    await this.repo.saveToken(userId, token);
  }

  async isTokenValid(token: string): Promise<boolean> {
    const found = await this.repo.findToken(token);
    return !!found;
  }

  async logout(token: string): Promise<void> {
    const found = await this.repo.findToken(token);
    if (!found) {
      throw new UnauthorizedException('Token not found or already invalidated');
    }
    await this.repo.deleteToken(token);
  }
}

