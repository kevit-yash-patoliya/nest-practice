import {
    Controller,
    Get,
    Post,
    Req,
    UseGuards,
    Body,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import type { Request } from 'express';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly jwtService: JwtService,
        private readonly authService: AuthService,
        private readonly eventService: EventEmitter2,
    ) {}

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Body() body: LoginDto) {
        this.eventService.emit('login', body);

        const user = await this.authService.login(body);

        const token = this.jwtService.sign({
            sub: user._id,
            username: user.username,
            role: user.role,
        });

        // Persist token in DB so it can be invalidated on logout
        await this.authService.storeToken(user._id, token);

        return { token };
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    getProfile(@Req() req) {
        return req.user;
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('logout')
    async logout(@Req() req: Request) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            throw new UnauthorizedException('No token provided');
        }

        await this.authService.logout(token);
        return { message: 'Logged out successfully' };
    }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    googleLogin() {}

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleCallback(@Req() req) {
        const token = this.jwtService.sign(req.user);

        // Persist Google OAuth token in DB as well
        await this.authService.storeToken(req.user.sub, token);

        return { token, user: req.user };
    }

    @Post('register')
    async register(@Body() body: RegisterDto) {
        const user = await this.authService.register(body);
        return user;
    }

    @OnEvent('login')
    runOnEmitter() {
        console.log('Login successfully');
    }
}
