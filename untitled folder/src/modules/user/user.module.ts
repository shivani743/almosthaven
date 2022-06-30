import { forwardRef, HttpModule, HttpService, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { userSchema } from '../../models/user.model';

import { UserController } from './user.controller';
import { UserService } from './user.service';

import { ScheduleModule } from '@nestjs/schedule';
import { tripSchema } from 'src/models/trip.model';

@Module({
  imports: [
    
    MongooseModule.forFeature([
      { name: 'User', schema: userSchema },
      { name: 'Trip', schema: tripSchema },
      // { name: 'Linkedin', schema: linkedinSchema },
      { name: 'UserDuplicate', schema: userSchema },
    ]),
    ScheduleModule.forRoot()
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
