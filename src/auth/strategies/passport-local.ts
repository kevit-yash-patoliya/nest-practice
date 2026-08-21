import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            usernameField: 'username',
            passwordField: 'password',
            
        });
    }
    async validate(username: string, password: string) {
        console.log('Username:', username);
        console.log('Password:', password);

        // Normally you would validate the credentials with a service here
        return { username };
    }
}