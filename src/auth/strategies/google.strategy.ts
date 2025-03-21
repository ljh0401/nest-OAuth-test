import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";
import { ConfigService } from "@nestjs/config";
import { MemberService } from "../../member/member.service";
import { CreateMemberDto } from "../../member/dto";
import { ProviderRole, RoleRole, Member } from "../../member/entities";
import { Profile as GoogleProfile } from "passport-google-oauth20";
import { VerifyCallback } from "passport-google-oauth20";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(
    private readonly configService: ConfigService,
    private readonly memberService: MemberService
  ) {
    super({
        clientID: configService.get<string>('GOOGLE_CLIENT_ID') ?? '',
        clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') ?? '',
        callbackURL: '/auth/google/callback',
        scope: ['email', 'profile'],
      });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile,
    done: VerifyCallback
  ): Promise<void> {
    const email = profile.emails?.[0]?.value ?? "".as.String;
    const nickname = profile.displayName ?? "";
    const name = profile.name?.givenName ?? nickname;

    if (!email || !nickname || !name) {
      return done(new Error("Missing required Google profile information"), null);
    }

    try {
      const existingUser: Member | null = await this.memberService.findByEmail(email);

      if (existingUser) {
        return done(null, existingUser);
      }

      const newUser: CreateMemberDto = {
        email,
        nickname,
        name,
        provider: ProviderRole.GOOGLE,
        role: RoleRole.CHILD, // 기본 역할
      };

      const createdUser: Member = await this.memberService.create(newUser);
      return done(null, createdUser);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return done(error, null);
      }
      return done(new Error("Unknown error during Google authentication"), null);
    }
  }
}
