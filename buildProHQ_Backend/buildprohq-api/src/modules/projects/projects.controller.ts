import {
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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../infrastructure/common/guards/roles.guard';
import { Roles } from '../../infrastructure/common/decorators/roles.decorator';
import { CurrentUser } from '../../infrastructure/common/decorators/current-user.decorator';
import type { AuthUser } from '../../infrastructure/common/interfaces/auth-user.interface';
import { ProjectsService } from './projects.service';
import { ProjectFiltersService } from '../project-filters/project-filters.service';
import { SearchProjectsDto } from './dto/search-projects.dto';
import { CreateProjectDto, UpdateProjectDto } from './dto/create-project.dto';
import {
  AssignProjectMemberDto,
  SearchProjectMembersDto,
} from './dto/search-project-members.dto';

@ApiTags('projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'projects', version: '1' })
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly projectFiltersService: ProjectFiltersService,
  ) { }

  @Get('my')
  @Roles('super_admin', 'manager', 'field_user', 'trade_user')
  @ApiOperation({
    summary: 'List projects visible to the current user (for dropdowns)',
  })
  myProjects(@CurrentUser() actor: AuthUser) {
    return this.projectsService.listMyProjects(actor);
  }

  @Post('search')
  @Roles('super_admin', 'manager')
  @ApiOperation({
    summary: 'List/search projects (pagination + sort + search)',
  })
  @ApiBody({ type: SearchProjectsDto })
  search(@CurrentUser() actor: AuthUser, @Body() dto: SearchProjectsDto) {
    return this.projectsService.searchProjects(actor, dto);
  }

  @Post()
  @Roles('super_admin')
  @ApiOperation({ summary: 'Create a project (super admin)' })
  @ApiBody({ type: CreateProjectDto })
  create(@CurrentUser() actor: AuthUser, @Body() dto: CreateProjectDto) {
    return this.projectsService.createProject(actor, dto);
  }

  @Get(':projectId')
  @Roles('super_admin', 'manager')
  @ApiOperation({ summary: 'Get project details by ID' })
  getOne(
    @CurrentUser() actor: AuthUser,
    @Param('projectId', new ParseUUIDPipe({ version: '4' })) projectId: string,
  ) {
    return this.projectsService.getProjectById(actor, projectId);
  }

  @Patch(':projectId')
  @Roles('super_admin', 'manager')
  @ApiOperation({ summary: 'Update project details' })
  @ApiBody({ type: UpdateProjectDto })
  update(
    @CurrentUser() actor: AuthUser,
    @Param('projectId', new ParseUUIDPipe({ version: '4' })) projectId: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectsService.updateProject(actor, projectId, dto);
  }

  @Post(':projectId/members')
  @Roles('super_admin', 'manager')
  @ApiOperation({
    summary: 'List/search project members (pagination + search)',
  })
  @ApiBody({ type: SearchProjectMembersDto })
  members(
    @CurrentUser() actor: AuthUser,
    @Param('projectId', new ParseUUIDPipe({ version: '4' })) projectId: string,
    @Body() dto: SearchProjectMembersDto,
  ) {
    return this.projectsService.listMembers(actor, projectId, dto);
  }

  @Get(':projectId/members')
  @Roles('super_admin', 'manager')
  @ApiOperation({
    summary: 'List/search project members (pagination + search)',
  })
  membersGet(
    @CurrentUser() actor: AuthUser,
    @Param('projectId', new ParseUUIDPipe({ version: '4' })) projectId: string,
    @Query() dto: SearchProjectMembersDto,
  ) {
    return this.projectsService.listMembers(actor, projectId, dto);
  }

  @Get(':projectId/filters')
  @Roles('super_admin', 'manager', 'field_user', 'trade_user')
  @ApiOperation({
    summary: 'Get project filters for task forms (categories + sub-filters)',
  })
  projectFilters(
    @Param('projectId', new ParseUUIDPipe({ version: '4' })) projectId: string,
  ) {
    return this.projectFiltersService.listForTaskForm(projectId);
  }

  @Post(':projectId/members/assign')
  @Roles('super_admin', 'manager')
  @ApiOperation({ summary: 'Assign user to project (super admin)' })
  @ApiBody({ type: AssignProjectMemberDto })
  assign(
    @CurrentUser() actor: AuthUser,
    @Param('projectId', new ParseUUIDPipe({ version: '4' })) projectId: string,
    @Body() dto: AssignProjectMemberDto,
  ) {
    return this.projectsService.assignMember(actor, projectId, dto);
  }

  @Delete(':projectId/members/:userId')
  @Roles('super_admin', 'manager')
  @ApiOperation({ summary: 'Unassign user from project (super admin)' })
  unassign(
    @CurrentUser() actor: AuthUser,
    @Param('projectId', new ParseUUIDPipe({ version: '4' })) projectId: string,
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
  ) {
    return this.projectsService.unassignMember(actor, projectId, userId);
  }

  @Get(':projectId/members/:userId/assigned-tasks/count')
  @Roles('super_admin', 'manager')
  @ApiOperation({ summary: 'Count tasks in project assigned to a user' })
  memberAssignedTasksCount(
    @CurrentUser() actor: AuthUser,
    @Param('projectId', new ParseUUIDPipe({ version: '4' })) projectId: string,
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
  ) {
    return this.projectsService.countMemberAssignedTasks(actor, projectId, userId);
  }

  @Delete(':projectId')
  @Roles('super_admin')
  @ApiOperation({ summary: 'Delete a project (super admin)' })
  deleteProject(
    @CurrentUser() actor: AuthUser,
    @Param('projectId', new ParseUUIDPipe({ version: '4' })) projectId: string,
    @Ip() ipAddress?: string,
    @Headers('x-request-id') requestId?: string,
    @Headers('user-agent') userAgent?: string,
  ) {
    return this.projectsService.deleteProject(actor, projectId, {
      ipAddress: ipAddress || null,
      requestId: requestId || null,
      userAgent: userAgent || null,
    });
  }
}
