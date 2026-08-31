import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, Length } from "class-validator";

export class RegisterDto{
    @ApiProperty({example:"admin"})
    @IsString()
    @Length(3,10)
    username!:string;
    @ApiProperty({example:"[EMAIL_ADDRESS]"})
    @IsEmail()
    email!:string;
    @ApiProperty({example:"1234"})
    @IsString()
    password!:string;
    @ApiProperty({example:"user"})
    role?:string;
}