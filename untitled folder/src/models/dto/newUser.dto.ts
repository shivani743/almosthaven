export interface NewUser {
  fName: string;
  lName?: string;
  email?: string;
  password?: string;
  phoneNum?: string;
  ip?: string;
  activationToken?: string;
  accessToken?: string;
  activationExpires?: number;
  role?: string;
  active?: string;
  imgpath?: string;
  gender?: string;
  dob?: Date;
  status?: string;
}
