import {
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../infrastructure/common/guards/roles.guard';
import { Roles } from '../../infrastructure/common/decorators/roles.decorator';
import { FiltersService } from './filters.service';
import { SaveFilterDto } from './dto/save-filter.dto';
import { QuickAddDto } from './dto/quick-add.dto';

@ApiTags('filters')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'filters', version: '1' })
export class FiltersController {
  constructor(private readonly filtersService: FiltersService) {}

  @Post()
  @Roles('manager')
  @ApiOperation({ summary: 'Create or update filter category/options (manager)' })
  @ApiBody({ type: SaveFilterDto })
  save(@Body() dto: SaveFilterDto) {
    return this.filtersService.saveFilter(dto);
  }

  @Post('levels')
  @Roles('manager')
  @ApiOperation({ summary: 'Quick add a level (manager)' })
  @ApiBody({ type: QuickAddDto })
  addLevel(@Body() dto: QuickAddDto) {
    return this.filtersService.quickAddLevel(dto.name);
  }

  @Post('trades')
  @Roles('manager')
  @ApiOperation({ summary: 'Quick add a trade (manager)' })
  @ApiBody({ type: QuickAddDto })
  addTrade(@Body() dto: QuickAddDto) {
    return this.filtersService.quickAddTrade(dto.name);
  }

  @Delete('categories/:id')
  @Roles('manager')
  @ApiOperation({ summary: 'Delete a filter category (manager)' })
  deleteCategory(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.filtersService.deleteCategory(id);
  }

  @Delete('options/:id')
  @Roles('manager')
  @ApiOperation({ summary: 'Delete a filter option (manager)' })
  deleteOption(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.filtersService.deleteOption(id);
  }
}

