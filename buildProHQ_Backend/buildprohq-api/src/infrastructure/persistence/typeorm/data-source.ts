import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { ALL_TYPEORM_ENTITIES } from './entities';

dotenv.config();

const common = {
  type: 'postgres' as const,
  synchronize: false,
  logging: process.env.DB_LOGGING === 'true',
  entities: ALL_TYPEORM_ENTITIES,
  migrations: [__dirname + '/migrations/*.ts'],
  subscribers: [],
};

export const AppDataSource = new DataSource(
  process.env.DATABASE_URL
    ? { ...common, url: process.env.DATABASE_URL }
    : {
        ...common,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      },
);
