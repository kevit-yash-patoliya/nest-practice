import { Body, Controller, Get, HttpException, HttpStatus, Inject, Logger, Param, ParseArrayPipe, ParseBoolPipe, ParseIntPipe, Post, UploadedFile, UploadedFiles, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Role } from 'src/common/enums/role';
import { Roles } from 'src/common/decorators/roles';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Delay } from 'src/common/interceptors/delay';
import { HttpExceptionFilter } from 'src/common/filters/exception.filter';
import { ConfigService } from '@nestjs/config';
import { CreateUserPipe } from 'src/pipes/create-user.pipe';
import { TestingInterceptors } from 'src/common/interceptors/testing.interceptors';
import { UserService } from './user.service';

@Roles(Role.User)
@Controller('user')
export class UserController {
    private readonly logger = new Logger(UserController.name)
    constructor(@Inject(UserService) private userService: UserService) { }

    @UseInterceptors(FileInterceptor('file'))
    @Post('upload')
    upload(@UploadedFile() file: Express.Multer.File): string {
        console.log(file);
        return 'uploaded';
    }
    @UseInterceptors(FilesInterceptor('files'))
    @Post('upload-many')
    uploadMany(@UploadedFiles() files: Express.Multer.File[]): string {
        console.log(files);
        return 'uploaded';
    }

    @UseInterceptors(FileFieldsInterceptor([{ 'name': 'file' }, { 'name': 'files' }]))
    @Post('upload-many-fields')
    uploadManyFields(@UploadedFiles() files: Express.Multer.File[]): string {
        console.log(files);
        return 'uploaded';
    }

    // @UseInterceptors(CacheInterceptor)
    @UseInterceptors(TestingInterceptors)
    @Post('/')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Roles(Role.Admin)
    // @UseInterceptors(Delay)
    @UseFilters(HttpExceptionFilter)
    // @Body(CreateUserPipe) body:object
    async getData() {
        const res = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await res.json();
        return data;
    }

    @Get(':id')
    @UseFilters(HttpExceptionFilter)
    findOne(@Param('id') id: string) {
        console.log(typeof id); // 'number'
        return this.userService.findById(id)
        // throw new HttpException("Something went wrong", HttpStatus.BAD_REQUEST);
    }


}
