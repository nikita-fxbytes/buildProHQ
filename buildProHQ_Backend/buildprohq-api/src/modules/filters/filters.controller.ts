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
import { QuickAddLevelDto } from './dto/quick-add-level.dto';
import { QuickAddTradeDto } from './dto/quick-add-trade.dto';

@ApiTags('filters')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'filters', version: '1' })
export class FiltersController {
  constructor(private readonly filtersService: FiltersService) {}

  @Post()
  @Roles('manager', 'super_admin')
  @ApiOperation({ summary: 'Create or update filter category/options (manager/super admin)' })
  @ApiBody({ type: SaveFilterDto })
  save(@Body() dto: SaveFilterDto) {
    return this.filtersService.saveFilter(dto);
  }

  @Post('levels')
  @Roles('manager')
  @ApiOperation({ summary: 'Quick add a level (manager)' })
  @ApiBody({ type: QuickAddLevelDto })
  addLevel(@Body() dto: QuickAddLevelDto) {
    return this.filtersService.quickAddLevel(dto.levelName);
  }

  @Post('trades')
  @Roles('manager')
  @ApiOperation({ summary: 'Quick add a trade (manager)' })
  @ApiBody({ type: QuickAddTradeDto })
  addTrade(@Body() dto: QuickAddTradeDto) {
    return this.filtersService.quickAddTrade(dto.tradeName);
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

