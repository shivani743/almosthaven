/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { NewUser } from '../../models/dto/newUser.dto';
import { Roles } from '../../utils/guards/roles.decorator';
import { RolesGuard } from '../../utils/guards/roles.guard';
import { diskStorage } from 'multer';
// import { JwtUserAuthGuard } from '../auth/jwt-user-auth.guard';
import { UserService } from './user.service';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { identity, of } from 'rxjs';

import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { join } from 'path';
// import { UserIsUserGuard } from 'src/auth/guards/UserIsUser.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async create(@Body() user: NewUser) {
    return await this.userService.create(user);
  }
  @Get('getemailfb/:fbid')
  async getE(@Param() fbid: any) {
    return await this.userService.findemailbyfbid(fbid.fbid);
  }
  // @Get('gete')
  // async getEm() {
  //   return await this.userService.finde();
  // }

  @Post('registerGoogle')
  async createGoogle(@Body() user: NewUser) {
    return await this.userService.createGoogle(user);
  }

  @Get('checkfb/:fbid')
  async checkfb(@Param() fbid, @Res() res: Response) {
    return await this.userService.findByFbid(fbid.fbid);
  }


  // @UseGuards(JwtUserAuthGuard, RolesGuard)
  @Roles('user', 'enterprise', 'admin')
  @Get('profile')
  async get(@Request() req, @Res() res: Response) {
    const user = await this.userService.findById(req.user.id.trim());
    return res.status(200).send(user);
  }
  // @UseGuards(JwtUserAuthGuard, RolesGuard)
  @Roles('user', 'enterprise', 'admin')
  @Get('findbyemail')
  async findbyemail(
    @Request() req,
    @Body() email: string,
    @Res() res: Response,
  ) {
    const user = await this.userService.findByEmail(email.valueOf());

    return res.status(200).send(user);
  }
  @Roles('user', 'enterprise', 'admin')
  @Get('findbyem/:email')
  async findbyemai(@Request() req, @Param() email: any, @Res() res: Response) {
    const user = await this.userService.findByEmail(email.email);
    if (user) {
      return res.status(200).send('true');
    } else {
      return res.status(200).send('false');
    }
  }

  @Get('fb/:fbid')
  async findfb(@Request() req, @Param() fbid, @Res() res: Response) {
    const user = await this.userService.findByFbid(fbid.fbid);

    return res.status(200).send(user);
  }

  @Get('activate')
  async activate(@Request() req, @Res() res: Response) {
    const uid = (<string>req.query.id).trim();
    const activationToken = (<string>req.query.token).trim();
    await this.userService.activateUser(uid, activationToken);
    res.status(200).send({ status: 'Account Activated Successfully.' });
  }

  @Get()
  // @UseGuards(JwtUserAuthGuard, RolesGuard)
  @Roles('user', 'admin')
  async getAll(@Res() res: Response) {
    const users = await this.userService.findAll();
    return res.status(200).send(users);
  }

  // @UseGuards(JwtUserAuthGuard, RolesGuard)
  @Roles('user', 'enterprise', 'admin')
  @Patch('profile')
  async update(@Request() req, @Body() user: {}) {
    return await this.userService.updateById(req.user.id.trim(), user);
  }

  // @UseGuards(JwtUserAuthGuard, RolesGuard)
  // @Roles('user', 'enterprise', 'admin')
  // @Patch('followCompany')
  // async followCompany(@Request() req ) {
  //   return await this.userService.addCompanyFollows(req.user.id.trim(), req.query.id);
  // }

  @Get('find/:id')
  async getUserById(@Param('id') id: string, @Res() res: Response) {
    const user = await this.userService.findUserById(id.trim());
    return res.status(200).send(user);
  }
  @Get('suggestplace')
  async getQueryAuto(@Query() query, @Res() res: Response) {
    console.log(query)
    const user = await this.userService.queryAutoComplete(query.query);
    return res.status(200).send(user);
  }
  @Get('placedetails/:id')
  async getPlaceDetails(@Param('id') query: string, @Res() res: Response) {
    const user = await this.userService.getPlaceDetails(query);
    return res.status(200).send(user);
  }

  @Post('getplan/:ip')
  async getPlan(@Req() req: Request, @Param('ip') ip, @Body() query, @Res() res: Response) {
    const user = await this.userService.getPlan(ip,query);
    return res.status(200).send(user);
  }
  @Post('newtrip')
  async newtrip(@Req() req: Request, @Body() query, @Res() res: Response) {
    const user = await this.userService.newTrip(query);
    return res.status(200).send(user);
  }

  @Post('tripupdate/:id')
  async upd(@Req() req: Request, @Param('id') id, @Body() query, @Res() res: Response) {
    const user = await this.userService.postToTrip(id,query);
    return res.status(200).send(user);
  }

  @Get('photos/:id')
  async photos(@Param('id') query: string, @Res() res: Response) {
    const user = await this.userService.getphotsFromPlaceId(query);
    return res.status(200).send(user);
  }
  @Get('userbyip/:ip')
  async Ipuser(@Param('ip') query: string, @Res() res: Response) {
    const user = await this.userService.findByIp(query);
    return res.status(200).send(user);
  }
  @Get('tripbyid/:id')
  async tripbyid(@Param('id') query: string, @Res() res: Response) {
    const user = await this.userService.findTripById(query);
    return res.status(200).send(user);
  }
  @Post('textsearch')
  async GetText(@Req() req: Request, @Body() query, @Res() res: Response) {
    const user = await this.userService.textSearch(query.text);
    return res.status(200).send(user);
  }

  @Get('nearbyplaces/:id')
  async getNearby(@Req() req: Request, @Param('id') id, @Res() res: Response) {
    const user = await this.userService.getNearbyPlaces(id);
    return res.status(200).send(user);
  }

  // @UseGuards(JwtUserAuthGuard, RolesGuard)
  @Roles('user', 'enterprise', 'admin')
  @Delete('profile')
  async remove(@Request() req) {
    await this.userService.removeById(req.user.id.trim());
  }
}
