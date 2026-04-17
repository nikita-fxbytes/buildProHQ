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
  @Header(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate',
  )
  @ApiOkResponse({
    description: 'Task stats fetched successfully',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        message: 'Task stats fetched successfully',
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
  @ApiOperation({
    summary:
      'Deprecated: legacy manager dashboard analytics. Use POST /v1/analytics/tasks for dynamic filter analytics.',
  })
  @ApiOkResponse({
    description: 'Analytics fetched successfully',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        message: 'Analytics fetched successfully',
        data: {
          openTasks: 12,
          completedTotal: 42,
          avgCompletionDays: 6,
          overdueTop: [{ daysOpen: 11, description: 'Finish wall painting – north side', user: 'RG' }],
          byUser: [{ user: 'RG', completed: 10 }],
          completionRate: [{ month: '2026-03', total: '20', completed: '12' }],
        },
        meta: null,
      },
    },
  })
  getAnalytics(@CurrentUser() user: AuthUser) {
    // Legacy endpoint retained for routing/back-compat, but Level/Trade analytics are removed.
    return this.tasksService.getAnalytics(user);
  }

  @Get('recent')
  @Roles('manager', 'super_admin')
  @ApiOperation({ summary: 'Get recently added tasks (latest created)' })
  getRecent(@CurrentUser() user: AuthUser, @Query('limit') limit?: string) {
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
            filter_summary: 'Zone: North, Priority: High',
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
  @ApiOperation({
    summary: 'List/search all tasks (all statuses) with filters',
  })
  searchAll(@CurrentUser() user: AuthUser, @Body() dto: SearchOpenTasksDto) {
    return this.tasksService.searchAll(user, dto);
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
  @ApiBody({
    type: CreateTaskDto,
    examples: {
      dynamicFilters: {
        value: {
          title: 'Patch drywall in unit 12B',
          projectId: '15004760-efa3-406e-9a24-18a6c64f8d51',
          statusId: '1b6a0fb1-2d3f-4f05-8c7f-5c9fdb1e3d42',
          priorityId: 'b6aa624b-1ed1-449c-8118-1a47b1cbbe67',
          assignedToUserIds: ['9b7fdb4c-2c3a-4518-8e64-16412cb27f0c'],
          taskFilterValues: [
            {
              filterId: '3ef6b5be-2a0b-4a08-9c0a-2e64e2d7a8d2',
              subFilterIds: ['7f5f5b27-f59d-4f47-b1d2-b99eb3c8bf6d'],
            },
          ],
          dueAt: '2026-04-30',
          description: '<p>Patch drywall in unit 12B</p>',
          notes: 'Bring replacement mesh tape.',
        },
      },
    },
  })
  createTask(@Body() dto: CreateTaskDto, @CurrentUser() user: AuthUser) {
    return this.tasksService.create(dto, user);
  }

  @Patch(':id')
  @Roles('manager', 'field_user', 'super_admin')
  @ApiOperation({ summary: 'Update task (manager/field user/super admin)' })
  @ApiBody({
    type: UpdateTaskDto,
    examples: {
      updateFilters: {
        value: {
          title: 'Patch drywall in unit 12B',
          projectId: '15004760-efa3-406e-9a24-18a6c64f8d51',
          priorityId: 'b6aa624b-1ed1-449c-8118-1a47b1cbbe67',
          assignedToUserIds: ['9b7fdb4c-2c3a-4518-8e64-16412cb27f0c'],
          taskFilterValues: [
            {
              filterId: '3ef6b5be-2a0b-4a08-9c0a-2e64e2d7a8d2',
              subFilterIds: ['7f5f5b27-f59d-4f47-b1d2-b99eb3c8bf6d'],
            },
          ],
          dueAt: '2026-05-02',
          description: '<p>Updated scope and due date.</p>',
        },
      },
    },
  })
  updateTask(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateTaskDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.tasksService.update(id, dto, user);
  }

  @Patch(':taskId/status')
  @Roles('manager', 'field_user', 'super_admin')
  @ApiOperation({
    summary: 'Update task status (manager/field user/super admin)',
  })
  @ApiBody({ type: UpdateTaskStatusDto })
  updateTaskStatus(
    @Param('taskId', new ParseUUIDPipe({ version: '4' })) taskId: string,
    @Body() dto: UpdateTaskStatusDto,
    @CurrentUser() user: AuthUser,
    @Ip() ipAddress?: string,
    @Headers('x-request-id') requestId?: string,
    @Headers('user-agent') userAgent?: string,
  ) {
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
          const ext = (
            path.extname(file.originalname).toLowerCase() || '.bin'
          ).replace('.jpeg', '.jpg');
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
          return cb(
            new BadRequestException(MESSAGES.FILES.INVALID_TYPE),
            false,
          );
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
    if (!id) {
      throw new BadRequestException('taskId is required');
    }
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
