import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({example:"admin"})
    username:string;
    @ApiProperty({example:"1234"})
    password:string;
}
