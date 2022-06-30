import { AuthService } from './auth.service';
declare const LocalUserStrategy_base: new (...args: any[]) => any;
export declare class LocalUserStrategy extends LocalUserStrategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    validate(email: string, password: string): Promise<any>;
}
export {};
