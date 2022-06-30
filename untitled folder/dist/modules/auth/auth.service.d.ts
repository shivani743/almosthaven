import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    private validate;
    private findByCredentials;
    login(data: any, type: 'User' | 'Enterprise'): Promise<{
        user: import("../../models/user.model").User;
        authToken: string;
    }>;
    private googleAuth;
    facebookAuth(data: any, type: 'User'): Promise<{
        user: import("../../models/user.model").User;
        authToken: string;
    }>;
    linkedinAuth(link: any): Promise<void>;
    linLogin(link: any): Promise<void>;
    googleLogin(req: any): Promise<any>;
    linkedinLogin(req: any): Promise<"No user from Linkedin" | {
        message: string;
        user: any;
    }>;
    private logout;
    private logoutAll;
    validateUser(email: string, password: string): Promise<any>;
    validateEnterprise(email: string, password: string): Promise<any>;
    findUserByCredentials(uid: string, authToken: string): Promise<import("../../models/user.model").User>;
    findEnterpriseByCredentials(eid: string, authToken: string): Promise<import("../../models/user.model").User>;
    loginUser(user: any): Promise<{
        user: import("../../models/user.model").User;
        authToken: string;
    }>;
    loginFacebook(body: any): Promise<{
        user: import("../../models/user.model").User;
        authToken: string;
    }>;
    loginGoogleUser(user: any): Promise<{
        user: import("../../models/user.model").User;
        authToken: string;
    }>;
    loginEnterprise(enterprise: any): Promise<{
        user: import("../../models/user.model").User;
        authToken: string;
    }>;
    logoutUser(user: any, headers: any): Promise<import("../../models/user.model").User>;
    logoutEnterprise(enterprise: any, headers: any): Promise<import("../../models/user.model").User>;
    logoutUserAll(user: any): Promise<import("../../models/user.model").User>;
    logoutEnterpriseAll(enterprise: any): Promise<import("../../models/user.model").User>;
}
