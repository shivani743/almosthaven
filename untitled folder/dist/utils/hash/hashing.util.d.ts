import { User } from '../../models/user.model';
export declare function hashPassword(password: string): Promise<string>;
export declare function comparePassword(customer: User, password: string): Promise<boolean>;
