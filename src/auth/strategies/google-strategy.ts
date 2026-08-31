import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL ?? 'http://localhost:3000/auth/google/callback',
            scope: ['email', 'profile'],
        });
    }

    validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
    ) {
        return {
            googleId: profile.id,
            email: profile.emails?.[0]?.value,
            username: profile.displayName,
            firstName: profile.name?.givenName,
            lastName: profile.name?.familyName,
            accessToken,
        };
    }
}