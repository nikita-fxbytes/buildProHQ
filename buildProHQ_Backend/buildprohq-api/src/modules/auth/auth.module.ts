import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { InvitationsService } from './invitations.service';
import {
  InvitationStatus,
  Role,
  User,
  UserInvitation,
  UserRole,
  UserType,
} from '../../infrastructure/persistence/typeorm/entities';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserType,
      UserRole,
      Role,
      UserInvitation,
      InvitationStatus,
    ]),
    PassportModule,
    MailModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') as string,
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN', '1d') as any,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, InvitationsService],
  exports: [AuthService, InvitationsService],
})
export class AuthModule {}
