import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Ip,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';
import type { Request } from 'express';
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
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { PagedQueryDto } from './dto/paged-query.dto';
import { MESSAGES } from '../../infrastructure/common/constants/messages';
import { TaskStatsQueryDto } from './dto/task-stats-query.dto';
import { Header } from '@nestjs/common';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'tasks', version: '1' })
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get task counts for dashboard' })
  @Header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
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
  getStats(@CurrentUser() user: AuthUser, @Query() query: TaskStatsQueryDto) {
    return this.tasksService.getStats(user, query);
  }

  @Get('analytics')
  @Roles('manager', 'super_admin')
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

  @Get('recent')
  @Roles('manager', 'super_admin')
  @ApiOperation({ summary: 'Get recently added tasks (latest created)' })
  getRecent(
    @CurrentUser() user: AuthUser,
    @Query('limit') limit?: string,
  ) {
    const n = Math.min(10, Math.max(1, Number(limit ?? 6) || 6));
    return this.tasksService.getRecentTasks(user, n);
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

  @Post('search')
  @ApiOperation({ summary: 'List/search all tasks (all statuses) with filters' })
  searchAll(@CurrentUser() user: AuthUser, @Body() dto: SearchOpenTasksDto) {
    return this.tasksService.searchAll(user, dto);
  }

  @Get('completed')
  @ApiOperation({
    summary: 'List completed tasks with pagination/filter/search (query string)',
    description:
      'Prefer POST /tasks/completed when sending many filter IDs. This endpoint remains for simple clients.',
  })
  @ApiOkResponse({
    description: 'Completed tasks fetched successfully',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        message: 'Completed tasks fetched successfully',
        data: [
          {
            id: '0b2f6a2d-4c79-4b52-9b5a-0b873ad58a52',
            description: 'Finish wall painting – north side',
            days_open: 11,
            created_at: '2026-03-10T08:00:00.000Z',
            opened_at: '2026-03-10T08:00:00.000Z',
            closed_at: '2026-04-01T16:00:00.000Z',
            status_code: 'completed',
            status_name: 'Completed',
            trade_name: 'Painter',
            level_name: 'L10',
          },
        ],
        meta: {
          page: 1,
          limit: 20,
          total: 25,
          totalPages: 2,
        },
      },
    },
  })
  listCompleted(@CurrentUser() user: AuthUser, @Query() query: QueryTasksDto) {
    return this.tasksService.listCompleted(user, query);
  }

  @Post('completed')
  @Roles('manager', 'field_user', 'trade_user', 'super_admin')
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
  @ApiOkResponse({
    description: 'Completed tasks fetched successfully',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        message: 'Completed tasks fetched successfully',
        data: [
          {
            id: '0b2f6a2d-4c79-4b52-9b5a-0b873ad58a52',
            description: 'Finish wall painting – north side',
            days_open: 11,
            closed_at: '2026-04-01T16:00:00.000Z',
            trade_name: 'Painter',
            level_name: 'L10',
            completed_by_user_id: null,
            completed_by_initials: null,
            completed_by_full_name: null,
          },
        ],
        meta: {
          page: 1,
          limit: 20,
          total: 25,
          totalPages: 2,
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
  @Roles('manager', 'field_user', 'super_admin')
  @ApiOperation({
    summary: 'Create task (manager/field user/super admin)',
    description:
      'Creates an open action item. Send `statusId` for the `open` status from GET /lookups/task-statuses. Optional `priorityId` from GET /lookups/task-priorities.',
  })
  @ApiBody({ type: CreateTaskDto })
  createTask(@Body() dto: CreateTaskDto, @CurrentUser() user: AuthUser) {
    return this.tasksService.create(dto, user);
  }

  @Patch(':id')
  @Roles('manager', 'field_user', 'super_admin')
  @ApiOperation({ summary: 'Update task (manager/field user/super admin)' })
  updateTask(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateTaskDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.tasksService.update(id, dto, user);
  }

  @Patch(':taskId/status')
  @Roles('manager', 'field_user', 'super_admin')
  @ApiOperation({ summary: 'Update task status (manager/field user/super admin)' })
  @ApiBody({ type: UpdateTaskStatusDto })
  updateTaskStatus(
    @Param('taskId', new ParseUUIDPipe({ version: '4' })) taskId: string,
    @Body() dto: UpdateTaskStatusDto,
    @CurrentUser() user: AuthUser,
    @Ip() ipAddress?: string,
    @Headers('x-request-id') requestId?: string,
    @Headers('user-agent') userAgent?: string,
  ) {
    // TEMP debug to prove route is registered/hit (remove after verifying).
    // eslint-disable-next-line no-console
    console.log('STATUS API HIT', { taskId, status: dto?.status });
    return this.tasksService.updateStatus(taskId, dto, user, {
      ipAddress: ipAddress || null,
      requestId: requestId || null,
      userAgent: userAgent || null,
    });
  }

  @Get('debug-status')
  @ApiOperation({ summary: 'Debug: verify TasksController is loaded' })
  debugStatus() {
    return 'TASK CONTROLLER WORKING';
  }

  @Delete(':id')
  @Roles('manager', 'field_user', 'super_admin')
  @ApiOperation({
    summary: 'Delete task (manager/field user/super admin, with scope checks)',
  })
  deleteTask(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @CurrentUser() user: AuthUser,
    @Ip() ipAddress?: string,
    @Headers('x-request-id') requestId?: string,
    @Headers('user-agent') userAgent?: string,
  ) {
    return this.tasksService.delete(id, user, {
      ipAddress: ipAddress || null,
      requestId: requestId || null,
      userAgent: userAgent || null,
    });
  }

  @Post(':id/assign')
  @Roles('manager', 'field_user', 'super_admin')
  @ApiOperation({
    summary: 'Assign or reassign task and persist assignment history',
  })
  assignTask(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: AssignTaskDto,
    @CurrentUser() user: AuthUser,
    @Ip() ipAddress?: string,
    @Headers('x-request-id') requestId?: string,
    @Headers('user-agent') userAgent?: string,
  ) {
    return this.tasksService.assign(id, dto, user, {
      ipAddress: ipAddress || null,
      requestId: requestId || null,
      userAgent: userAgent || null,
    });
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
  @Roles('manager', 'field_user', 'trade_user', 'super_admin')
  @ApiOperation({ summary: 'Add task comment' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['comment'],
      properties: {
        comment: { type: 'string' },
        files: { type: 'array', items: { type: 'string', format: 'binary' } },
      },
    },
  })
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const dir = path.join(process.cwd(), 'uploads');
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (_req, file, cb) => {
          const ext = (path.extname(file.originalname).toLowerCase() || '.bin')
            .replace('.jpeg', '.jpg');
          cb(null, `${randomUUID()}${ext}`);
        },
      }),
      limits: { fileSize: 12 * 1024 * 1024, files: 5 },
      fileFilter: (_req, file, cb) => {
        const okMime =
          /^image\/(jpeg|png|webp)$/i.test(file.mimetype) ||
          file.mimetype === 'application/pdf' ||
          file.mimetype === 'application/msword' ||
          file.mimetype ===
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        const okExt = /\.(jpe?g|png|webp|pdf|doc|docx)$/i.test(
          file.originalname,
        );
        if (!okMime && !okExt) {
          return cb(new BadRequestException(MESSAGES.FILES.INVALID_TYPE), false);
        }
        cb(null, true);
      },
    }),
  )
  addComment(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: CommentTaskDto,
    @CurrentUser() user: AuthUser,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: Request,
  ) {
    return this.tasksService.addComment(id, dto, user, files ?? [], req);
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'Get task comments' })
  getComments(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @CurrentUser() user: AuthUser,
    @Query() query: PagedQueryDto,
  ) {
    return this.tasksService.getCommentsPaged(id, user, query);
  }

  @Get(':id/history')
  @ApiOperation({ summary: 'Get task workflow history' })
  getHistory(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @CurrentUser() user: AuthUser,
    @Query() query: PagedQueryDto,
  ) {
    return this.tasksService.getHistoryPaged(id, user, query);
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

