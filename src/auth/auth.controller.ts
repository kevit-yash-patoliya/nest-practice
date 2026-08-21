import { Controller, Get, Post, Req, UseGuards, BadRequestException, Body, Inject, UseFilters } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { HttpExceptionFilter } from 'src/common/filters/exception.filter';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';


@Controller('auth')
export class AuthController {
    constructor(
        private readonly jwtService: JwtService, 
        private readonly authService:AuthService,
        private readonly eventService:EventEmitter2
    ) {}

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Body() body:LoginDto){
        this.eventService.emit('login',body);

        await this.authService.login(body);
        
        const token = this.jwtService.sign(body);
        return {token}
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    getProfile(@Req() req) {
        return req.user;
    }

    @Post('register')
    async register(@Body() body:RegisterDto){
        const user = await this.authService.register(body);
        return user;
    }

    @OnEvent("login")
    runOnEmitter(){
        console.log("Login successfully")
    }
}

