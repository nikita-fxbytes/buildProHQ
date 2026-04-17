import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../infrastructure/common/guards/roles.guard';
import { Roles } from '../../infrastructure/common/decorators/roles.decorator';
import { CurrentUser } from '../../infrastructure/common/decorators/current-user.decorator';
import type { AuthUser } from '../../infrastructure/common/interfaces/auth-user.interface';
import { MESSAGES } from '../../infrastructure/common/constants/messages';
import { ProjectFiltersService } from './project-filters.service';
import { CreateProjectFilterDto } from './dto/create-project-filter.dto';
import { UpdateProjectFilterDto } from './dto/update-project-filter.dto';
import { ListProjectFiltersQueryDto } from './dto/list-project-filters-query.dto';
import { SearchProjectFiltersDto } from './dto/search-project-filters.dto';

@ApiTags('project-filters')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'project-filters', version: '1' })
export class ProjectFiltersController {
  constructor(private readonly projectFiltersService: ProjectFiltersService) {}

  @Get()
  @Roles('super_admin', 'manager')
  @ApiOperation({ summary: 'List user-defined project filters (CRUD table)' })
  @ApiInternalServerErrorResponse({
    description: 'Database error',
    schema: {
      example: {
        success: false,
        statusCode: 500,
        message: 'A data processing error occurred',
      },
    },
  })
  async list(
    @CurrentUser() actor: AuthUser,
    @Query() query: ListProjectFiltersQueryDto,
  ) {
    // Back-compat: prefer POST /project-filters/search for production usage.
    // Keep GET route so existing clients don't break.
    try {
      return await this.projectFiltersService.listDefinitions(actor, query);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('PROJECT FILTER ERROR:', error);
      throw new InternalServerErrorException(MESSAGES.COMMON.DATABASE_ERROR);
    }
  }

  @Post('search')
  @Roles('super_admin', 'manager')
  @ApiOperation({
    summary: 'List/search project filters (POST body + pagination + sorting)',
  })
  @ApiBody({
    type: SearchProjectFiltersDto,
    examples: {
      default: {
        value: {
          page: 1,
          limit: 20,
          search: 'zone',
          sortBy: 'createdAt',
          sortOrder: 'DESC',
          projectIds: ['15004760-efa3-406e-9a24-18a6c64f8d51'],
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Project filters fetched successfully',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        message: 'Success',
        data: [
          {
            id: '3ef6b5be-2a0b-4a08-9c0a-2e64e2d7a8d2',
            name: 'Zone',
            projectId: null,
            projectName: 'Tower A',
            type: 'sub_filter',
            isMultiSelect: true,
            hasSubFilters: true,
            createdAt: '2026-04-17T08:00:00.000Z',
            subFiltersCount: 4,
          },
        ],
        meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Database error',
    schema: {
      example: {
        success: false,
        statusCode: 500,
        message: 'A data processing error occurred',
      },
    },
  })
  async search(
    @CurrentUser() actor: AuthUser,
    @Body() dto: SearchProjectFiltersDto,
  ) {
    try {
      return await this.projectFiltersService.searchDefinitions(actor, dto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('PROJECT FILTER ERROR:', error);
      throw new InternalServerErrorException(MESSAGES.COMMON.DATABASE_ERROR);
    }
  }

  @Get(':id')
  @Roles('super_admin', 'manager')
  @ApiOperation({ summary: 'Get one project filter definition' })
  @ApiInternalServerErrorResponse({
    description: 'Database error',
    schema: {
      example: {
        success: false,
        statusCode: 500,
        message: 'A data processing error occurred',
      },
    },
  })
  async getOne(
    @CurrentUser() actor: AuthUser,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    try {
      return await this.projectFiltersService.getDefinition(actor, id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('PROJECT FILTER ERROR:', error);
      throw new InternalServerErrorException(MESSAGES.COMMON.DATABASE_ERROR);
    }
  }

  @Post()
  @Roles('super_admin', 'manager')
  @ApiOperation({ summary: 'Create a project filter definition' })
  @ApiBody({
    type: CreateProjectFilterDto,
    examples: {
      withSubFilters: {
        value: {
          name: 'Zone',
          projectIds: ['15004760-efa3-406e-9a24-18a6c64f8d51'],
          hasSubFilters: true,
          isMultiSelect: true,
          subFilterNames: ['North', 'South', 'East', 'West'],
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Project filter created successfully',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        message: 'Success',
        data: {
          id: '3ef6b5be-2a0b-4a08-9c0a-2e64e2d7a8d2',
          name: 'Zone',
          projectId: '15004760-efa3-406e-9a24-18a6c64f8d51',
          projectIds: ['15004760-efa3-406e-9a24-18a6c64f8d51'],
          hasSubFilters: true,
          isMultiSelect: true,
          subFilters: [
            { id: '7f5f5b27-f59d-4f47-b1d2-b99eb3c8bf6d', name: 'North' },
          ],
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Database error',
    schema: {
      example: {
        success: false,
        statusCode: 500,
        message: 'A data processing error occurred',
      },
    },
  })
  async create(
    @CurrentUser() actor: AuthUser,
    @Body() dto: CreateProjectFilterDto,
  ) {
    try {
      return await this.projectFiltersService.createDefinition(actor, dto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('PROJECT FILTER ERROR:', error);
      throw new InternalServerErrorException(MESSAGES.COMMON.DATABASE_ERROR);
    }
  }

  @Patch(':id')
  @Roles('super_admin', 'manager')
  @ApiOperation({ summary: 'Update a project filter definition' })
  @ApiBody({
    type: UpdateProjectFilterDto,
    examples: {
      renameAndAppend: {
        value: {
          name: 'Zone',
          projectIds: ['15004760-efa3-406e-9a24-18a6c64f8d51'],
          hasSubFilters: true,
          isMultiSelect: true,
          subFilterNames: ['North', 'South', 'East', 'West', 'Lobby'],
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Database error',
    schema: {
      example: {
        success: false,
        statusCode: 500,
        message: 'A data processing error occurred',
      },
    },
  })
  async update(
    @CurrentUser() actor: AuthUser,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateProjectFilterDto,
  ) {
    try {
      return await this.projectFiltersService.updateDefinition(actor, id, dto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('PROJECT FILTER ERROR:', error);
      throw new InternalServerErrorException(MESSAGES.COMMON.DATABASE_ERROR);
    }
  }

  @Delete(':id')
  @Roles('super_admin', 'manager')
  @ApiOperation({ summary: 'Soft-delete a project filter definition' })
  @ApiInternalServerErrorResponse({
    description: 'Database error',
    schema: {
      example: {
        success: false,
        statusCode: 500,
        message: 'A data processing error occurred',
      },
    },
  })
  async remove(
    @CurrentUser() actor: AuthUser,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    try {
      return await this.projectFiltersService.deleteDefinition(actor, id);
    } catch (error) {
      // Allow proper client behavior for validation failures.
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('PROJECT FILTER ERROR:', error);
      throw new InternalServerErrorException(MESSAGES.COMMON.DATABASE_ERROR);
    }
  }
}
