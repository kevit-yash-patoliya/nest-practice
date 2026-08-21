import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AuthRepo } from './auth.repo';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
constructor(private repo:AuthRepo) {}

  validateSession(userId: string) {
    const user = this.repo.findByUsername(userId); // needs UsersService
    return !!user;
  }
  async register(registerDto:RegisterDto){
    const user = await this.repo.create(registerDto);
    return user;
  }
  async login(loginDto:LoginDto){
    const user = await this.repo.findByUsername(loginDto.username);
    if(!user){
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

} 
