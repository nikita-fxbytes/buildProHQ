import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../../infrastructure/common/decorators/roles.decorator';
import { RolesGuard } from '../../infrastructure/common/guards/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from '../../infrastructure/common/decorators/current-user.decorator';
import type { AuthUser } from '../../infrastructure/common/interfaces/auth-user.interface';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('manager')
  @ApiOperation({ summary: 'List all active users (manager only)' })
  listUsers() {
    return this.usersService.list();
  }

  @Get(':id')
  @Roles('manager')
  @ApiOperation({ summary: 'Get user details by id (manager only)' })
  getUser(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.usersService.getById(id);
  }

  @Post()
  @Roles('manager')
  @ApiOperation({ summary: 'Create user (manager only)' })
  createUser(@Body() dto: CreateUserDto, @CurrentUser() actor: AuthUser) {
    return this.usersService.create(dto, actor.id);
  }

  @Patch(':id')
  @Roles('manager')
  @ApiOperation({ summary: 'Update user (manager only)' })
  updateUser(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() actor: AuthUser,
  ) {
    return this.usersService.update(id, dto, actor.id);
  }
}
