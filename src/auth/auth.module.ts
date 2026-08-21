import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/passport-local';
import { JwtStrategy } from './strategies/jwt-strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { AuthRepo } from './auth.repo';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/register.schema';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventEmitter } from 'stream';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, AuthRepo, EventEmitter],
  imports: [
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '1d' },
    }),
    forwardRef(() => UserModule),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    EventEmitterModule.forRoot()

  ],
  exports: [AuthService]
})
export class AuthModule { }




