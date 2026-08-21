import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, HydratedDocument } from "mongoose";
import { Role } from "src/common/enums/role";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User extends Document{

    @Prop({required:[true,"username is required"], unique:[true,"username is already taken"]})
    username:string;
    @Prop({required:[true,"email is required"], unique:[true,"email is already taken"]})
    email:string;
    @Prop({required:[true,"password is required"]})
    password:string;
    @Prop({required:true,default:Role.User})
    role:Role;
}

export const UserSchema = SchemaFactory.createForClass(User);