import { Document, Schema } from 'mongoose';
import { hashPassword } from '../utils/hash/hashing.util';
import validator from 'validator';

export const userSchema = new Schema(
  {
    fName: {
      type: String,
      required: true,
      trim: true,
    },
    lName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: false,
      trim: true,
      lowercase: true,
     
    },
    

    password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
    },
    
    username: {
      type: String,
      trim: true,
    },
    intro: {
      type: String,
      trim: true,
    },
    phoneNum: {
      type: String,
      required: false,
      validate(value) {
        if (
          !validator.isMobilePhone(value, ['en-US', 'en-AU', 'en-IN', 'uk-UA'])
        )
          throw new Error('Phone number is not a valid one');
        return true;
      },
    },
    role: {
      type: String,
      required: true,
      enum: ['user', 'enterprise', 'admin'],
      default: 'user',
    },
    
    fbid: { type: String, default: '1234' },

    fbToken: {
      type: String,
    },
    active: { type: Boolean, default: true, required: true },
    activationToken: { type: String },
    activationExpires: { type: Number },
    imgpath: { type: String },
    gender: { type: String },
    instaId: { type: String },
    linkedInId: { type: String },
    twitterId: { type: String },
    personalWebsite: { type: String },
trips: [{
  type: String
}],
    status: { type: String, default: 'offline' },
    
    feedback: [{ type: String }],

    ip: { type: String },
    isDeactivated: { type: Boolean, default: false },
    dob: { type: Date },
    
    accessToken: { type: String },
    likesRecieved: [{ type: String }],
    access_tokens: [
      {
        token: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true },
);
userSchema.pre<User>('save', async function(next) {
  if (this.isModified('password'))
    this.password = await hashPassword(this.password);
  next();
});
export interface User extends Document {
  id: string;
  fName: string;
  lName: string;
  email?: string;
  
  password: string;
  phoneNum?: string;
  status?: string;
  role: string;
  fbid?: string;
  intro?: string;
  ip?: string;
  fbToken?: string;
  active: boolean;
  activationToken: string;
  activationExpires: number;
 trips: string[];
  imgpath?: string;
  instaId?: string;
  username?: string;
  linkedInId?: string;
  twitterId?: string;
  personalWebsite?: string;

  // location?: Location[];
  
  access_tokens: { token: string }[];
  accessToken?: { token: string };
 
  gender?: string;
  viewers?: { uid: string; seenAt: Date }[];
  feedback?: string[];
  dob?: Date;
  isDeactivated: boolean;
}
