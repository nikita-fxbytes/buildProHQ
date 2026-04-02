import { BadRequestException, Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LookupsService } from './lookups.service';
import { isUUID } from 'class-validator';

@ApiTags('lookups')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'lookups', version: '1' })
export class LookupsController {
  constructor(private readonly lookupsService: LookupsService) {}

  @Get('trades')
  getTrades() {
    return this.lookupsService.getTrades();
  }

  @Get('levels')
  getLevels() {
    return this.lookupsService.getLevels();
  }

  @Get('task-statuses')
  getTaskStatuses() {
    return this.lookupsService.getTaskStatuses();
  }

  @Get('task-priorities')
  getTaskPriorities() {
    return this.lookupsService.getTaskPriorities();
  }

  @Get('filter-categories')
  getFilterCategories() {
    return this.lookupsService.getFilterCategories();
  }

  @Get('filter-options')
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  getFilterOptions(@Query('categoryId') categoryId?: string) {
    if (!categoryId) {
      return this.lookupsService.getFilterOptions();
    }
    if (!isUUID(categoryId, 4)) {
      throw new BadRequestException('categoryId must be a valid UUID');
    }
    return this.lookupsService.getFilterOptions(categoryId);
  }
}
