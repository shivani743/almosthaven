/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from '../../utils/hash/hashing.util';
import { UserService } from '../user/user.service';

interface ValidationType {
  email: string;
  password: string;
}

interface CredentialType {
  id: string;
  authToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * ! ----- Private Utility Methods -----
   */

  private async validate(
    { email, password }: ValidationType,
    type: 'User' | 'Enterprise',
  ) {
    switch (type) {
      case 'User':
        const user = await this.userService.findByEmail(email);
        if (!user) return null;

        const isValidUser = await comparePassword(user, password);
        if (!isValidUser) return null;

        user.password = undefined;

        return user;

      default:
        throw new BadRequestException('Not a valid customer type');
    }
  }

  private async findByCredentials(
    { id, authToken }: CredentialType,
    type: 'User' | 'Enterprise',
  ) {
    switch (type) {
      case 'User':
        return await this.userService.findByAuthCredentials(id, authToken);

      default:
        throw new BadRequestException('Not a valid customer type');
    }
  }

  public async login(data: any, type: 'User' | 'Enterprise') {
    switch (type) {
      case 'User':
        const user = data;
        const userPayload = { email: user.email, sub: user._id };
      user.status = 'online';
      user.isDeactivated = 'false';
     
        return await this.userService.grantAccess(
          user._id,
          this.jwtService.sign(userPayload),
        );

      default:
        throw new BadRequestException('Not a valid customer type');
    }
  }
  private async googleAuth(data: any, type: 'User') {
    const user = data;
   
    user.status = 'online'
    const userPayload = { email: user.email, sub: user._id };

    return await this.userService.grantAccess(
      user._id,
      this.jwtService.sign(userPayload),
    );
  }
  async facebookAuth (data: any, type: 'User') {
    const user = data;
   
    user.status = 'online'
    const userPayload = { email: user.email, sub: user._id };

    return await this.userService.grantAccess(
      user._id,
      this.jwtService.sign(userPayload),
    );

  }
  async linkedinAuth(link) {
    const axios = require('axios');

    const linkedInToken = link;
    axios
      .post(
        `https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${linkedInToken.link}&redirect_uri=http://localhost:8100/login/linkedInLogin&client_id=8630dxhif4fa0b&client_secret=uEXrigai0o35iCVz`,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        },
      )
      .then(f => {
        const tok = f.data.access_token;

        
        const url = `https://api.linkedin.com/v2/me`;
        axios
          .get(url, {
            headers: {
              Authorization: 'Bearer ' + tok,
            },
          })
          .then(d => {
            const id = d.data.id;
    
            const fName = d.data.localizedFirstName;
            const lName = d.data.localizedLastName

            const url2 = ` https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))`;
            axios
              .get(url2, {
                headers: {
                  Authorization: 'Bearer ' + tok,
                },
              })
              .then(result => {
               
                const email = result.data.elements[0]['handle~'].emailAddress;

                
              
              const url3 = `https://api.linkedin.com/v2/me?projection=(id,profilePicture(displayImage~digitalmediaAsset:playableStreams))`;
              axios
              .get(url3, {
                headers: {
                  Authorization: 'Bearer ' + tok,
                },

              }).then(p => {
                const imgpath = p.data.profilePicture['displayImage~'].elements[3].identifiers[0].identifier
                const user = {
                  email: email,
                  password: id,
                  imgpath: imgpath,
                  fName: fName,
                  lName: lName
                  
                  
                };  
                // this.userService.createLinkedin(user)          
              })
                            
              

              });
          });
      });
  }

  async linLogin(link) {
    const axios = require('axios');

    const linkedInToken = link;
    axios
      .post(
        `https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${linkedInToken.link}&redirect_uri=http://localhost:8100/login/linkedInLogin&client_id=8630dxhif4fa0b&client_secret=uEXrigai0o35iCVz`,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        },
      )
      .then(f => {
        const tok = f.data.access_token;

        
        const url = `https://api.linkedin.com/v2/me`;
        axios
          .get(url, {
            headers: {
              Authorization: 'Bearer ' + tok,
            },
          })
          .then(d => {
            const id = d.data.id;
    
            const url2 = ` https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))`;
            axios
              .get(url2, {
                headers: {
                  Authorization: 'Bearer ' + tok,
                },
              })
              .then(result => {
               
                const email = result.data.elements[0]['handle~'].emailAddress;

                const user = {
                  email: email,
                  password: id

                }
                this.login(user, 'User')

              });
          });
      });
  }
  public async googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }
const user = req.user

    return  await user;
  }
  public async linkedinLogin(req) {
    if (!req.user) {
      return 'No user from Linkedin';
    }

    return {
      message: 'User information from Linkedin',
      user: req,
    };
  }
  private async logout(data: any, headers: any, type: 'User' | 'Enterprise') {
    switch (type) {
      case 'User':
        const user = data;
        const userAuthToken = (<string>headers.authorization).replace(
          'Bearer ',
          '',
        );
        return await this.userService.revokeAccess(user.id, userAuthToken);

      default:
        throw new BadRequestException('Not a valid customer type');
    }
  }

  private async logoutAll(id: string, type: 'User' | 'Enterprise') {
    switch (type) {
      case 'User':
        return await this.userService.revokeAccessAll(id);
    }
  }

  /**
   * ! ----- Private Utility Methods END -----
   */

  async validateUser(email: string, password: string): Promise<any> {
    return await this.validate({ email, password }, 'User');
  }

  async validateEnterprise(email: string, password: string): Promise<any> {
    return await this.validate({ email, password }, 'Enterprise');
  }

  async findUserByCredentials(uid: string, authToken: string) {
    return await this.findByCredentials({ id: uid, authToken }, 'User');
  }

  async findEnterpriseByCredentials(eid: string, authToken: string) {
    return await this.findByCredentials({ id: eid, authToken }, 'Enterprise');
  }

  async loginUser(user: any) {
    
    return await this.login(user, 'User');
  }
  async loginFacebook(body: any) {
    
    return await this.facebookAuth(body, 'User');
  }
  async loginGoogleUser(user: any) {
    return await this.googleAuth(user, 'User');
  }

  async loginEnterprise(enterprise: any) {
    return await this.login(enterprise, 'Enterprise');
  }

  async logoutUser(user: any, headers: any) {
    return await this.logout(user, headers, 'User');
  }

  async logoutEnterprise(enterprise: any, headers: any) {
    return await this.logout(enterprise, headers, 'Enterprise');
  }

  async logoutUserAll(user: any) {
    return await this.logoutAll(user.id, 'User');
  }

  async logoutEnterpriseAll(enterprise: any) {
    return await this.logoutAll(enterprise.id, 'Enterprise');
  }
}
