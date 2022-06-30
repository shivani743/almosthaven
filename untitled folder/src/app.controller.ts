/* eslint-disable @typescript-eslint/no-var-requires */
import { Controller, Get, Res } from '@nestjs/common';
import path from 'path';
// import passport from 'passport';
import { AppService } from './app.service';
// const passport = require('passport');
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  
  
}
