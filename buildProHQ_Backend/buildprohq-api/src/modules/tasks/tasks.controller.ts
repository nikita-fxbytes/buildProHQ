import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
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
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../../infrastructure/common/decorators/current-user.decorator';
import type { AuthUser } from '../../infrastructure/common/interfaces/auth-user.interface';
import { QueryTasksDto } from './dto/query-tasks.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Roles } from '../../infrastructure/common/decorators/roles.decorator';
import { RolesGuard } from '../../infrastructure/common/guards/roles.guard';
import { AssignTaskDto } from './dto/assign-task.dto';
import { CompleteTaskDto } from './dto/complete-task.dto';
import { CommentTaskDto } from './dto/comment-task.dto';
import { AddAttachmentDto } from './dto/add-attachment.dto';
import { BulkTasksDto } from './dto/bulk-tasks.dto';
import { SearchOpenTasksDto } from './dto/search-open-tasks.dto';
import { SearchCompletedTasksDto } from './dto/search-completed-tasks.dto';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'tasks', version: '1' })
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get task counts for dashboard' })
  @ApiOkResponse({
    description: 'Task stats fetched successfully',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        message: 'Success',
        data: {
          totalOpen: 12,
          totalCompleted: 5,
          urgent: 3,
          overdue: 4,
          overdue10: 2,
          midRange7to10: 2,
          fresh0to6: 8,
          tradesActive: 4,
        },
        meta: null,
      },
    },
  })
  getStats(@CurrentUser() user: AuthUser) {
    return this.tasksService.getStats(user);
  }

  @Get('analytics')
  @Roles('manager')
  @ApiOperation({ summary: 'Get grouped analytics for manager dashboard' })
  @ApiOkResponse({
    description: 'Analytics fetched successfully',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        message: 'Success',
        data: {
          openTasks: 12,
          completedTotal: 42,
          avgCompletionDays: 6,
          byTrade: [{ trade: 'Painter', count: 4 }],
          byLevel: [{ level: 'L2', count: 3 }],
          overdueTop: [
            { daysOpen: 11, level: 'L10', description: 'Finish wall painting – north side', user: 'RG' },
          ],
          byUser: [{ user: 'RG', completed: 10 }],
          completionRate: [{ month: '2026-03', total: '20', completed: '12' }],
        },
        meta: null,
      },
    },
  })
  getAnalytics(@CurrentUser() user: AuthUser) {
    return this.tasksService.getAnalytics(user);
  }

  @Post('open')
  @ApiOperation({
    summary: 'List/search open tasks with filters (POST body)',
  })
  @ApiBody({
    type: SearchOpenTasksDto,
    examples: {
      managerList: {
        summary: 'Manager tasks list (search + sort + filters)',
        value: {
          page: 1,
          limit: 10,
          search: 'painting',
          sortBy: 'priority',
          sortOrder: 'desc',
          filters: {
            createdByUserIds: ['9b7fdb4c-2c3a-4518-8e64-16412cb27f0c'],
            tradeIds: ['8c2d41e3-5f5a-4b2d-9c6b-6e2d7c9b1a11'],
            levelIds: ['0f1a2b3c-4d5e-4f60-8a7b-9c0d1e2f3a4b'],
          },
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Action items fetched successfully',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        message: 'Action items fetched successfully',
        data: [
          {
            id: '0b2f6a2d-4c79-4b52-9b5a-0b873ad58a52',
            description: 'Finish wall painting – north side',
            days_open: 11,
            created_at: '2026-03-21T11:20:00.000Z',
            opened_at: '2026-03-10T08:00:00.000Z',
            closed_at: null,
            assigned_to_user_id: null,
            created_by_user_id: '9b7fdb4c-2c3a-4518-8e64-16412cb27f0c',
            created_by_initials: 'RG',
            created_by_full_name: 'Rob Gar',
            status_id: '1b6a0fb1-2d3f-4f05-8c7f-5c9fdb1e3d42',
            priority_id: null,
            status_code: 'open',
            status_name: 'Open',
            priority_code: null,
            priority_name: null,
            trade_name: 'Painter',
            level_name: 'L10',
          },
        ],
        meta: {
          page: 1,
          limit: 10,
          total: 24,
          totalPages: 3,
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
  searchOpen(@CurrentUser() user: AuthUser, @Body() dto: SearchOpenTasksDto) {
    return this.tasksService.searchOpen(user, dto);
  }

  @Get('completed')
  @ApiOperation({
    summary: 'List completed tasks with pagination/filter/search',
  })
  listCompleted(@CurrentUser() user: AuthUser, @Query() query: QueryTasksDto) {
    return this.tasksService.listCompleted(user, query);
  }

  @Post('completed')
  @Roles('manager', 'field_user', 'trade_user')
  @ApiOperation({
    summary: 'List/search completed tasks with filters (POST body)',
    description:
      'Completed tasks listing with pagination, search, sorting, and manager filters (trade/level/completed-by user).',
  })
  @ApiBody({
    type: SearchCompletedTasksDto,
    examples: {
      managerList: {
        summary: 'Manager completed list (search + sort + filters)',
        value: {
          page: 1,
          limit: 10,
          search: 'drywall',
          sortBy: 'date',
          sortOrder: 'desc',
          filters: {
            completedByUserIds: ['9b7fdb4c-2c3a-4518-8e64-16412cb27f0c'],
            tradeIds: ['8c2d41e3-5f5a-4b2d-9c6b-6e2d7c9b1a11'],
            levelIds: ['0f1a2b3c-4d5e-4f60-8a7b-9c0d1e2f3a4b'],
          },
        },
      },
    },
  })
  searchCompleted(@CurrentUser() user: AuthUser, @Body() dto: SearchCompletedTasksDto) {
    return this.tasksService.searchCompleted(user, dto);
  }

  @Post('bulk-complete')
  @Roles('manager', 'field_user')
  @ApiOperation({ summary: 'Mark multiple tasks as complete' })
  bulkComplete(@Body() dto: BulkTasksDto, @CurrentUser() user: AuthUser) {
    return this.tasksService.bulkComplete(dto, user);
  }

  @Delete('bulk-delete')
  @Roles('manager', 'field_user')
  @ApiOperation({
    summary: 'Delete multiple tasks (Manager/Field User, with scope checks)',
  })
  bulkDelete(@Body() dto: BulkTasksDto, @CurrentUser() user: AuthUser) {
    return this.tasksService.bulkDelete(dto, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task detail by id with role scope checks' })
  getTask(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.tasksService.getById(id, user);
  }

  @Post()
  @Roles('manager', 'field_user')
  @ApiOperation({
    summary: 'Create task (manager/field user)',
    description:
      'Creates an open action item. Send `statusId` for the `open` status from GET /lookups/task-statuses. Optional `priorityId` from GET /lookups/task-priorities.',
  })
  @ApiBody({ type: CreateTaskDto })
  createTask(@Body() dto: CreateTaskDto, @CurrentUser() user: AuthUser) {
    return this.tasksService.create(dto, user);
  }

  @Patch(':id')
  @Roles('manager', 'field_user')
  @ApiOperation({ summary: 'Update task (manager/field user)' })
  updateTask(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateTaskDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.tasksService.update(id, dto, user);
  }

  @Delete(':id')
  @Roles('manager', 'field_user')
  @ApiOperation({
    summary: 'Delete task (manager/field user, with scope checks)',
  })
  deleteTask(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.tasksService.delete(id, user);
  }

  @Post(':id/assign')
  @Roles('manager', 'field_user')
  @ApiOperation({
    summary: 'Assign or reassign task and persist assignment history',
  })
  assignTask(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: AssignTaskDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.tasksService.assign(id, dto, user);
  }

  @Post(':id/complete')
  @Roles('manager', 'field_user', 'trade_user')
  @ApiOperation({
    summary: 'Mark task complete and create completion/history records',
  })
  completeTask(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: CompleteTaskDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.tasksService.complete(id, dto, user);
  }

  @Post(':id/comments')
  @Roles('manager', 'field_user', 'trade_user')
  @ApiOperation({ summary: 'Add task comment' })
  addComment(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: CommentTaskDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.tasksService.addComment(id, dto, user);
  }

  @Get(':id/history')
  @ApiOperation({ summary: 'Get task workflow history' })
  getHistory(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.tasksService.getHistory(id, user);
  }

  @Get(':id/attachments')
  @ApiOperation({ summary: 'Get task attachments' })
  getAttachments(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.tasksService.getAttachments(id, user);
  }

  @Post(':id/attachments')
  @Roles('manager', 'field_user', 'trade_user')
  @ApiOperation({ summary: 'Attach file metadata to task' })
  @ApiBody({ type: AddAttachmentDto })
  addAttachment(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: AddAttachmentDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.tasksService.addAttachment(id, dto, user);
  }
}

