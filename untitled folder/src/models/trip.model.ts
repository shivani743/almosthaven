import { Document, Schema } from 'mongoose';
import { hashPassword } from '../utils/hash/hashing.util';
import validator from 'validator';

export const tripSchema = new Schema(
  {
 
   tripObj: {
      type: Object,
   }
});
export interface Trip extends Document {
  id: string;
  tripObj: any;
  
}