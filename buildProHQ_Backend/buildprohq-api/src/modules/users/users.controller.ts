import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../../infrastructure/common/decorators/roles.decorator';
import { RolesGuard } from '../../infrastructure/common/guards/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SearchUsersDto } from './dto/search-users.dto';
import { CurrentUser } from '../../infrastructure/common/decorators/current-user.decorator';
import type { AuthUser } from '../../infrastructure/common/interfaces/auth-user.interface';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile/me')
  @ApiOperation({ summary: 'Get my profile (all authenticated users)' })
  me(@CurrentUser() actor: AuthUser) {
    return this.usersService.getMyProfile(actor.id);
  }

  @Patch('profile/me')
  @ApiOperation({ summary: 'Update my profile (all authenticated users)' })
  updateMe(@Body() dto: UpdateProfileDto, @CurrentUser() actor: AuthUser) {
    return this.usersService.updateMyProfile(actor.id, dto);
  }

  @Get()
  @Roles('manager')
  @ApiOperation({ summary: 'List all active users (manager only)' })
  listUsers(@CurrentUser() actor: AuthUser) {
    return this.usersService.list(actor.id);
  }

  @Post()
  @Roles('manager')
  @ApiOperation({
    summary: 'List/search users with pagination (POST body, manager only)',
    description:
      'Preferred endpoint for the Users table. Supports pagination, search, role filter, and server-side sorting.',
  })
  @ApiBody({ type: SearchUsersDto })
  @ApiOkResponse({
    description: 'Users fetched successfully',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        message: 'Users fetched successfully',
        data: [
          {
            id: 'b0d31f13-7363-47e2-835c-ae815b892b49',
            full_name: 'Manager Admin',
            email: 'manager@buildpro.com',
            initials: 'MA',
            avatar_url: null,
            user_type_code: 'management',
            user_type_name: 'Management',
            user_status_code: 'active',
            user_status_name: 'Active',
            last_login_at: '2026-04-01T16:00:00.000Z',
            created_at: '2026-03-10T08:00:00.000Z',
            open_tasks_count: 3,
          },
        ],
        meta: {
          page: 1,
          limit: 10,
          total: 42,
          totalPages: 5,
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid request body',
    schema: {
      example: {
        success: false,
        statusCode: 400,
        message: 'Validation failed',
        error: { code: 'BAD_REQUEST', details: [] },
      },
    },
  })
  searchUsers(@Body() dto: SearchUsersDto, @CurrentUser() actor: AuthUser) {
    return this.usersService.search(actor.id, dto);
  }

  @Get(':id')
  @Roles('manager')
  @ApiOperation({ summary: 'Get user details by id (manager only)' })
  getUser(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.usersService.getById(id);
  }

  @Post('create')
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

  @Delete(':id')
  @Roles('manager')
  @ApiOperation({ summary: 'Delete (soft-delete) user (manager only)' })
  removeUser(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @CurrentUser() actor: AuthUser,
  ) {
    return this.usersService.remove(id, actor.id);
  }
}
