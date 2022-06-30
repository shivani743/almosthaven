import { Document, Schema } from 'mongoose';
export declare const tripSchema: Schema<Document<any, any>, import("mongoose").Model<any, any, any>, undefined>;
export interface Trip extends Document {
    id: string;
    unique_id: string;
    trips: string[];
}
