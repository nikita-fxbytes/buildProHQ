import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {
  User,
  UserRole,
  Task,
  TaskStatus,
} from '../../infrastructure/persistence/typeorm/entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRole, Task, TaskStatus])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
