import { Document, Schema } from 'mongoose';
export declare const userSchema: Schema<Document<any, any>, import("mongoose").Model<any, any, any>, undefined>;
export interface User extends Document {
    id: string;
    fName: string;
    lName: string;
    email: string;
    password: string;
    phoneNum?: number;
    status?: string;
    role: string;
    fbid?: string;
    intro?: string;
    fbToken?: string;
    active: boolean;
    activationToken: string;
    activationExpires: number;
    imgpath?: string;
    instaId?: string;
    username?: string;
    linkedInId?: string;
    twitterId?: string;
    personalWebsite?: string;
    access_tokens: {
        token: string;
    }[];
    accessToken?: {
        token: string;
    };
    gender?: string;
    viewers?: {
        uid: string;
        seenAt: Date;
    }[];
    feedback?: string[];
    dob?: Date;
    isDeactivated: boolean;
}
