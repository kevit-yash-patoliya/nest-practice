import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./schemas/register.schema";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthRepo{
    constructor(@InjectModel(User.name) private userModel:Model<UserDocument>) {}

    async create(user:RegisterDto):Promise<UserDocument>{
        const newUser = new this.userModel(user);
        return await newUser.save();
    }

    async findByUsername(username:string):Promise<UserDocument | null>{
        return await this.userModel.findOne({username:username});
    }


}