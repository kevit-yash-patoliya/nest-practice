import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/passport-local';
import { JwtStrategy } from './strategies/jwt-strategy';
import { GoogleStrategy } from './strategies/google-strategy';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { AuthRepo } from './auth.repo';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/register.schema';
import { Token, TokenSchema } from './schemas/token.schema';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, GoogleStrategy, AuthRepo],
  imports: [
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '1d' },
    }),
    forwardRef(() => UserModule),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Token.name, schema: TokenSchema },
    ]),
    EventEmitterModule.forRoot(),
  ],
  exports: [AuthService],
})
export class AuthModule {}





