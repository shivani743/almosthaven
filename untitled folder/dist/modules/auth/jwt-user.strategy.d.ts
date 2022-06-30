import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
declare const JwtUserStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtUserStrategy extends JwtUserStrategy_base {
    private readonly authService;
    private readonly configService;
    constructor(authService: AuthService, configService: ConfigService);
    validate(req: Request, payload: any): Promise<{
        id: any;
        email: any;
        role: string;
    }>;
}
export {};
