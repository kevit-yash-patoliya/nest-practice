import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { User, UserDocument } from "./schemas/register.schema";
import { Token, TokenDocument } from "./schemas/token.schema";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthRepo {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
    ) {}

    async create(user: RegisterDto): Promise<UserDocument> {
        const newUser = new this.userModel(user);
        return await newUser.save();
    }

    async findByUsername(username: string): Promise<UserDocument | null> {
        return await this.userModel.findOne({ username });
    }

    // ─── Token Management ───────────────────────────────────────────────

    async saveToken(userId: mongoose.Types.ObjectId, token: string): Promise<TokenDocument> {
        const newToken = new this.tokenModel({ userId, token });
        return await newToken.save();
    }

    async findToken(token: string): Promise<TokenDocument | null> {
        return await this.tokenModel.findOne({ token });
    }

    async deleteToken(token: string): Promise<void> {
        await this.tokenModel.deleteOne({ token });
    }
}