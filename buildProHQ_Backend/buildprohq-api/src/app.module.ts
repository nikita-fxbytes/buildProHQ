import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { LogLevel } from 'typeorm';
import {
  AuditModule,
  AuthModule,
  FilesModule,
  HealthModule,
  LookupsModule,
  MailModule,
  FiltersModule,
  TasksModule,
  UsersModule,
  NotificationsModule,
  ProjectsModule,
  ProjectFiltersModule,
  AnalyticsModule,
} from './modules';

import { ALL_TYPEORM_ENTITIES } from './infrastructure/persistence/typeorm/entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'test', 'production')
          .default('development'),
        PORT: Joi.number().default(3000),
        DATABASE_URL: Joi.string().min(1).required(),
        DB_LOGGING: Joi.boolean().default(false),
        JWT_SECRET: Joi.string().min(16).required(),
        JWT_EXPIRES_IN: Joi.string().default('1d'),
        CORS_ORIGIN: Joi.string().default('*'),
        THROTTLER_TTL: Joi.number().default(60000),
        THROTTLER_LIMIT: Joi.number().default(120),
        SWAGGER_PATH: Joi.string().default('api/docs'),
        MAX_FILE_SIZE_MB: Joi.number().default(10),
        FRONTEND_BASE_URL: Joi.string()
          .uri({ scheme: ['http', 'https'] })
          .required(),
        INVITE_TOKEN_SECRET: Joi.string()
          .min(16)
          .invalid('replace_with_a_long_random_secret')
          .required(),
        INVITE_EXPIRES_HOURS: Joi.number().default(48),
        SMTP_HOST: Joi.string().allow('').default(''),
        SMTP_PORT: Joi.number().default(587),
        SMTP_USER: Joi.string().allow('').default(''),
        SMTP_PASS: Joi.string().allow('').default(''),
        SMTP_FROM: Joi.string().allow('').default(''),
      })
        // If SMTP_HOST is set, require the rest.
        .when(Joi.object({ SMTP_HOST: Joi.string().min(1) }).unknown(), {
          then: Joi.object({
            SMTP_USER: Joi.string().min(1).required(),
            SMTP_PASS: Joi.string().min(1).required(),
            SMTP_FROM: Joi.string().min(1).required(),
          }),
        }),
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get<number>('THROTTLER_TTL') ?? 60000,
          limit: config.get<number>('THROTTLER_LIMIT') ?? 120,
        },
      ],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const logging: LogLevel[] | false = config.get<boolean>('DB_LOGGING')
          ? (['query', 'error'] satisfies LogLevel[])
          : false;

        const common = {
          type: 'postgres' as const,
          entities: ALL_TYPEORM_ENTITIES,
          synchronize: false,
          logging,
        };

        return { ...common, url: config.getOrThrow<string>('DATABASE_URL') };
      },
    }),
    AuditModule,
    HealthModule,
    FilesModule,
    MailModule,
    AuthModule,
    UsersModule,
    TasksModule,
    ProjectsModule,
    ProjectFiltersModule,
    AnalyticsModule,
    LookupsModule,
    FiltersModule,
    NotificationsModule,
  ],

  providers: [],
})
export class AppModule {}
