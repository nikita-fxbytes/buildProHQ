import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../infrastructure/common/guards/roles.guard';
import { Roles } from '../../infrastructure/common/decorators/roles.decorator';
import { AnalyticsService } from './analytics.service';
import { TasksAnalyticsDto } from './dto/tasks-analytics.dto';

@ApiTags('analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'analytics', version: '1' })
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Post('tasks')
  @Roles('super_admin', 'manager')
  @ApiOperation({ summary: 'Dynamic project-based task analytics' })
  @ApiBody({ type: TasksAnalyticsDto })
  @ApiOkResponse({
    description: 'Project-scoped task analytics',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        message: 'Project task analytics fetched successfully',
        data: {
          total: 120,
          completed: 42,
          inProgress: 18,
          overdue: 6,
          filters: [
            {
              filterId: '3ef6b5be-2a0b-4a08-9c0a-2e64e2d7a8d2',
              filterName: 'Zone',
              values: [
                { name: 'North', count: 12 },
                { name: 'South', count: 9 },
              ],
            },
          ],
        },
        meta: {},
      },
    },
  })
  tasks(@Body() dto: TasksAnalyticsDto) {
    return this.analytics.tasks(dto);
  }
}
