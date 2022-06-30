import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { environment } from '../../environments/config';

import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtUserStrategy } from './jwt-user.strategy';
import { LocalUserStrategy } from './local-user.strategy';

import { ConfigModule } from '@nestjs/config';
// import { GoogleStrategy } from './google.strategy';
// import { LinkedinStrategy } from './linkedin.strategy';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: 'z2xFDNUUmK0UwrQg4GtN',
      // signOptions: { expiresIn: '2h' },
    }),
  ],
  providers: [
    AuthService,
    LocalUserStrategy,
    
    JwtUserStrategy,
    
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
