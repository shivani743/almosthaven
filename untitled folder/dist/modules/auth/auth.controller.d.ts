/// <reference types="express-serve-static-core" />
/// <reference types="passport" />
import { Response } from 'express';
import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    loginUser(req: Express.Request, res: Response): Promise<Response<any, Record<string, any>>>;
    linlogin(req: Express.Request, res: Response, link: any): Promise<Response<any, Record<string, any>>>;
    loginLinkedin(req: any, link: any): Promise<void>;
    logoutUser(req: Express.Request, headers: any, res: Response): Promise<Response<any, Record<string, any>>>;
    logoutUserAll(req: Express.Request, res: Response): Promise<Response<any, Record<string, any>>>;
    googleAuth(req: any): Promise<void>;
    fb(req: Express.Request, res: Response): Promise<Response<any, Record<string, any>>>;
    googleAuthRedirect(req: any): Promise<any>;
    googleLogin(req: any, res: any): Promise<void>;
    linkedinAuth(req: any): Promise<void>;
    linkedinAuthRedirect(req: any): Promise<"No user from Linkedin" | {
        message: string;
        user: any;
    }>;
    logoutEnterprise(req: Express.Request, headers: any, res: Response): Promise<Response<any, Record<string, any>>>;
    logoutEnterpriseAll(req: Express.Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
