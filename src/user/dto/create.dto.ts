import { Transform, Type } from "class-transformer"
import { IsString, ValidateNested } from "class-validator"

class CreateProfileDto{
    @Type(()=>Date)
    dob:Date   
    @Type(()=>String)
    gender:String
}

export class CreateUserDto{
    @IsString()
    @Transform(({value})=>value.trim())
    name:string
    @IsString()
    @Transform(({value})=>value.trim().toLowerCase())
    email:string
    @IsString()
    @Transform(({value})=>value.trim())
    password:string
    @Type(()=>CreateProfileDto)
    @ValidateNested()
    profile:CreateProfileDto    
} 