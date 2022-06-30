import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtUserStrategy extends PassportStrategy(Strategy, 'jwt-user') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // ignoreExpiration: false,
      secretOrKey: 'z2xFDNUUmK0UwrQg4GtN',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const authToken = req.headers.authorization.replace('Bearer ', '');
    const verifiedUser = await this.authService.findUserByCredentials(
      payload.sub,
      authToken,
    );

    if (!verifiedUser)
      throw new UnauthorizedException('Invalid User Credentials');

    if (!verifiedUser.active)
      throw new ForbiddenException('User Credentials Not Verified');

    return {
      id: payload.sub,
      email: payload.email,
      role: verifiedUser.role,
    };
  }
}
