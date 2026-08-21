import { forwardRef, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from 'src/auth/auth.module';
import { LoggerMiddleware } from 'src/common/middlewares/logger.middleware';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports:[
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
          cb(null, uniqueSuffix + extname(file.originalname))
        },
      })
    }),
    CacheModule.register({
      ttl: 1000 * 10,
      isGlobal:true
    }),
    ScheduleModule.forRoot(),
    forwardRef(() =>AuthModule),
  ],
  exports:[UserService]
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Controller / Router level application
    consumer.apply(LoggerMiddleware).forRoutes(UserController);
  }
}
