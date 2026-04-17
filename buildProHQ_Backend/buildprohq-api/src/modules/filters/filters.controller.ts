import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../infrastructure/common/guards/roles.guard';
import { Roles } from '../../infrastructure/common/decorators/roles.decorator';
import { FiltersService } from './filters.service';
import { SaveFilterDto } from './dto/save-filter.dto';

@ApiTags('filters')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'filters', version: '1' })
export class FiltersController {
  constructor(private readonly filtersService: FiltersService) {}

  @Get()
  @Roles('manager', 'super_admin')
  @ApiOperation({
    summary: 'List filter categories + options (supports multi-project merge)',
  })
  list(
    @Query('projectId') projectId?: string,
    @Query('projectIds') projectIds?: string[] | string,
    @Query('projectIds[]') projectIdsBracket?: string[] | string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.filtersService.list({
      projectId,
      projectIds: projectIds ?? projectIdsBracket,
      search,
      page: Number(page ?? 1),
      limit: Number(limit ?? 20),
    });
  }

  @Post()
  @Roles('manager', 'super_admin')
  @ApiOperation({
    summary: 'Create or update filter category/options (manager/super admin)',
  })
  @ApiBody({ type: SaveFilterDto })
  save(@Body() dto: SaveFilterDto) {
    return this.filtersService.saveFilter(dto);
  }

  @Delete('categories/:id')
  @Roles('manager', 'super_admin')
  @ApiOperation({ summary: 'Delete a filter category (manager/super admin)' })
  deleteCategory(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.filtersService.deleteCategory(id);
  }

  @Delete('options/:id')
  @Roles('manager', 'super_admin')
  @ApiOperation({ summary: 'Delete a filter option (manager/super admin)' })
  deleteOption(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.filtersService.deleteOption(id);
  }
}
