/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtUserAuthGuard } from './jwt-user-auth.guard';
import { LocalUserAuthGuard } from './local-user-auth.guard';
// import { LocalEnterpriseAuthGuard } from './local-enterprise-auth.guard';

import { AuthGuard } from '@nestjs/passport';
// import passport from 'passport';
const passport = require('passport');

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalUserAuthGuard)
  @Post('user/login')
  async loginUser(@Request() req: Express.Request, @Res() res: Response) {
    const user = await this.authService.loginUser(req.user);

    return res.status(200).send(user);
  }


  @Post('user/loginlinkedin')
  async linlogin(@Request() req: Express.Request, @Res() res: Response, @Body() link) {
    const user = await this.authService.linLogin(link);

    return res.status(200).send(user);
  }
  

  @Post('user/linkedin')
  async loginLinkedin(@Request() req, @Body() link) {
    return await this.authService.linkedinAuth(link);
  }

  @UseGuards(JwtUserAuthGuard)
  @Post('user/logout')
  async logoutUser(
    @Request() req: Express.Request,
    @Headers() headers,
    @Res() res: Response,
  ) {
    const user = await this.authService.logoutUser(req.user, headers);
    return res.status(200).send(user);
  }

  @UseGuards(JwtUserAuthGuard)
  @Post('user/logoutAll')
  async logoutUserAll(@Request() req: Express.Request, @Res() res: Response) {
    const user = await this.authService.logoutUserAll(req.user);
    return res.status(200).send(user);
  }

  
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  
  @Post('user/facebook')
  async fb(@Request() req: Express.Request, @Res() res: Response) {
   
    const user = await this.authService.loginFacebook(req['body']);

    return res.status(200).send(user);
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
    
  }
  @Get('googleLogin')

  // @UseGuards(AuthGuard('google'))
  // @Post('user/login')
  // async loginUser(@Request() req: Express.Request, @Res() res: Response) {
  //   const user = await this.authService.loginUser(req.user);

  //   return res.status(200).send(user);
  // }
  async googleLogin(@Req() req, @Res() res) {
  
  }

  @Get('linkedin')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinAuth(@Req() req) {}

  @Get('linkedin/callback')
  @UseGuards(AuthGuard('linkedin'))
  linkedinAuthRedirect(@Req() req) {
    passport.authenticate('linkedin', {
      successRedirect: 'http://localhost:8100/login',
      failureRedirect: '/login',
    });
    return this.authService.linkedinLogin(req);
  }

  
  @Post('enterprise/logout')
  async logoutEnterprise(
    @Request() req: Express.Request,
    @Headers() headers,
    @Res() res: Response,
  ) {
    const enterprise = await this.authService.logoutEnterprise(
      req.user,
      headers,
    );
    return res.status(200).send(enterprise);
  }

  
  @Post('enterprise/logoutAll')
  async logoutEnterpriseAll(
    @Req() req: Express.Request,
    @Res() res: Response,
  ) {
    const enterprise = await this.authService.logoutEnterpriseAll(req.user);
    return res.status(200).send(enterprise);
  }
}
