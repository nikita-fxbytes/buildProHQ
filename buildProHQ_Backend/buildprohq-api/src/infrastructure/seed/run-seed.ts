import 'reflect-metadata';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.join(process.cwd(), '.env') });
console.log('Current working directory:', process.cwd());
console.log('Loading .env from:', path.join(process.cwd(), '.env'));
import { DataSource, IsNull } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  ALL_TYPEORM_ENTITIES,
  FilterCategory,
  FilterOption,
  Level,
  Project,
  ProjectUser,
  Role,
  Task,
  TaskPriority,
  TaskStatus,
  Trade,
  User,
  UserRole,
  UserStatus,
  UserType,
} from '../persistence/typeorm/entities';

const common = {
  type: 'postgres' as const,
  entities: ALL_TYPEORM_ENTITIES,
  synchronize: false,
};

const dataSource = new DataSource(
  process.env.DATABASE_URL
    ? { ...common, url: process.env.DATABASE_URL }
    : {
        ...common,
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT ?? 5432),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      },
);

async function getOrCreateByCode(
  repo: any,
  code: string,
  payload: Record<string, unknown>,
): Promise<any> {
  const existing = await repo.findOne({ where: { code, deletedAt: IsNull() } });
  if (existing) return existing;
  const entity = repo.create({ code, ...payload });
  return repo.save(entity);
}

async function getOrCreateUser(params: {
  userTypeId: string;
  userStatusId: string;
  fullName: string;
  initials: string;
  email: string;
  password: string;
}): Promise<User> {
  const repo = dataSource.getRepository(User);
  const existing = await repo.findOne({
    where: { email: params.email.toLowerCase(), deletedAt: IsNull() },
  });
  if (existing) return existing;
  const user = repo.create({
    userTypeId: params.userTypeId,
    userStatusId: params.userStatusId,
    fullName: params.fullName,
    initials: params.initials,
    email: params.email.toLowerCase(),
    passwordHash: await bcrypt.hash(params.password, 10),
  });
  return repo.save(user);
}

async function ensureUserRole(userId: string, roleId: string): Promise<void> {
  const repo = dataSource.getRepository(UserRole);
  const existing = await repo.findOne({
    where: { userId, roleId, deletedAt: IsNull() },
  });
  if (!existing) {
    const row = repo.create({ userId, roleId });
    await repo.save(row);
  }
}

async function ensureTask(params: {
  description: string;
  projectId: string;
  statusId: string;
  priorityId: string;
  levelId: string;
  tradeId: string;
  createdByUserId: string;
  assignedToUserId?: string;
  notes?: string;
}): Promise<void> {
  const repo = dataSource.getRepository(Task);
  const existing = await repo.findOne({
    where: {
      description: params.description,
      projectId: params.projectId,
      deletedAt: IsNull(),
    },
  });
  if (existing) return;
  const task = repo.create({
    description: params.description,
    projectId: params.projectId,
    statusId: params.statusId,
    priorityId: params.priorityId,
    levelId: params.levelId,
    tradeId: params.tradeId,
    createdByUserId: params.createdByUserId,
    assignedToUserId: params.assignedToUserId ?? null,
    notes: params.notes ?? null,
  });
  await repo.save(task);
}

async function run(): Promise<void> {
  await dataSource.initialize();
  console.log('Database initialized successfully.');
  console.log('Starting seed process...');

  const userTypeRepo = dataSource.getRepository(UserType);
  const userStatusRepo = dataSource.getRepository(UserStatus);
  const roleRepo = dataSource.getRepository(Role);
  const taskStatusRepo = dataSource.getRepository(TaskStatus);
  const taskPriorityRepo = dataSource.getRepository(TaskPriority);
  const tradeRepo = dataSource.getRepository(Trade);
  const levelRepo = dataSource.getRepository(Level);
  const filterCategoryRepo = dataSource.getRepository(FilterCategory);
  const filterOptionRepo = dataSource.getRepository(FilterOption);
  const projectRepo = dataSource.getRepository(Project);
  const projectUserRepo = dataSource.getRepository(ProjectUser);

  const fieldType = await getOrCreateByCode(userTypeRepo, 'field_user', {
    name: 'Field User',
  });
  const tradeType = await getOrCreateByCode(userTypeRepo, 'trade_user', {
    name: 'Trade User',
  });
  const managerType = await getOrCreateByCode(userTypeRepo, 'management', {
    name: 'Manager',
  });

  const activeStatus = await getOrCreateByCode(userStatusRepo, 'active', {
    name: 'Active',
    isActive: true,
  });
  await getOrCreateByCode(userStatusRepo, 'inactive', {
    name: 'Inactive',
    isActive: false,
  });

  const managerRole = await getOrCreateByCode(roleRepo, 'manager_admin', {
    name: 'Manager Admin',
    isSystemRole: true,
  });
  const superRole = await getOrCreateByCode(roleRepo, 'super_admin', {
    name: 'Super Admin',
    isSystemRole: true,
  });
  const fieldRole = await getOrCreateByCode(roleRepo, 'field_user', {
    name: 'Field User',
    isSystemRole: true,
  });
  const tradeRole = await getOrCreateByCode(roleRepo, 'trade_user', {
    name: 'Trade User',
    isSystemRole: true,
  });

  const openStatus = await getOrCreateByCode(taskStatusRepo, 'open', {
    name: 'Open',
    isTerminal: false,
  });
  await getOrCreateByCode(taskStatusRepo, 'in_progress', {
    name: 'In Progress',
    isTerminal: false,
  });
  const completedStatus = await getOrCreateByCode(taskStatusRepo, 'completed', {
    name: 'Completed',
    isTerminal: true,
  });
  await getOrCreateByCode(taskStatusRepo, 'deleted', {
    name: 'Deleted',
    isTerminal: true,
  });

  const lowPriority = await getOrCreateByCode(taskPriorityRepo, 'low', {
    name: 'Low',
    sortOrder: 1,
  });
  const mediumPriority = await getOrCreateByCode(taskPriorityRepo, 'medium', {
    name: 'Medium',
    sortOrder: 2,
  });
  const highPriority = await getOrCreateByCode(taskPriorityRepo, 'high', {
    name: 'High',
    sortOrder: 3,
  });
  await getOrCreateByCode(taskPriorityRepo, 'critical', {
    name: 'Critical',
    sortOrder: 4,
  });

  const painterTrade = await getOrCreateByCode(tradeRepo, 'painter', {
    name: 'Painter',
    sortOrder: 1,
  });
  const electricianTrade = await getOrCreateByCode(tradeRepo, 'electrician', {
    name: 'Electrician',
    sortOrder: 2,
  });
  await getOrCreateByCode(tradeRepo, 'plumber', {
    name: 'Plumber',
    sortOrder: 3,
  });
  await getOrCreateByCode(tradeRepo, 'plasterer', {
    name: 'Plasterer',
    sortOrder: 4,
  });

  const level1 = await getOrCreateByCode(levelRepo, 'l1', {
    name: 'L1',
    sortOrder: 1,
  });
  const level2 = await getOrCreateByCode(levelRepo, 'l2', {
    name: 'L2',
    sortOrder: 2,
  });
  await getOrCreateByCode(levelRepo, 'l3', { name: 'L3', sortOrder: 3 });
  for (let i = 4; i <= 10; i++) {
    await getOrCreateByCode(levelRepo, `l${i}`, {
      name: `L${i}`,
      sortOrder: i,
    });
  }

  const tradeCategory = await getOrCreateByCode(filterCategoryRepo, 'trade', {
    name: 'Trade',
    isSystemCategory: true,
    projectId: null,
  });
  const levelCategory = await getOrCreateByCode(filterCategoryRepo, 'level', {
    name: 'Level',
    isSystemCategory: true,
    projectId: null,
  });

  const ensureFilterOption = async (
    filterCategoryId: string,
    code: string,
    name: string,
    sortOrder: number,
  ): Promise<void> => {
    const existing = await filterOptionRepo.findOne({
      where: { filterCategoryId, code, deletedAt: IsNull() },
    });
    if (!existing) {
      const row = filterOptionRepo.create({
        filterCategoryId,
        code,
        name,
        sortOrder,
      });
      await filterOptionRepo.save(row);
    }
  };

  await ensureFilterOption(tradeCategory.id, 'painter', 'Painter', 1);
  await ensureFilterOption(tradeCategory.id, 'electrician', 'Electrician', 2);
  await ensureFilterOption(levelCategory.id, 'l1', 'L1', 1);
  await ensureFilterOption(levelCategory.id, 'l2', 'L2', 2);

  // Projects
  const ensureProject = async (code: string, name: string): Promise<Project> => {
    const existing = await projectRepo.findOne({
      where: { code, deletedAt: IsNull() },
    });
    if (existing) return existing;
    return projectRepo.save(projectRepo.create({ code, name }));
  };
  const p1 = await ensureProject('p1', 'Project Alpha — North Tower');
  const p2 = await ensureProject('p2', 'Project Beta — West Wing');

  const manager = await getOrCreateUser({
    userTypeId: managerType.id,
    userStatusId: activeStatus.id,
    fullName: 'Manager Admin',
    initials: 'MA',
    email: 'manager@buildpro.com',
    password: 'Manager@123',
  });
  const field = await getOrCreateUser({
    userTypeId: fieldType.id,
    userStatusId: activeStatus.id,
    fullName: 'Field User',
    initials: 'FU',
    email: 'field@buildpro.com',
    password: 'Field@123',
  });
  const trade = await getOrCreateUser({
    userTypeId: tradeType.id,
    userStatusId: activeStatus.id,
    fullName: 'Trade User',
    initials: 'TU',
    email: 'trade@buildpro.com',
    password: 'Trade@123',
  });
  const superAdmin = await getOrCreateUser({
    userTypeId: managerType.id,
    userStatusId: activeStatus.id,
    fullName: 'Super Admin',
    initials: 'SA',
    email: 'super@buildpro.com',
    password: 'Super@123',
  });

  await ensureUserRole(manager.id, managerRole.id);
  await ensureUserRole(field.id, fieldRole.id);
  await ensureUserRole(trade.id, tradeRole.id);
  await ensureUserRole(superAdmin.id, superRole.id);

  // Project membership (manager can be on multiple projects)
  const ensureProjectUser = async (
    projectId: string,
    userId: string,
    projectRole?: string,
  ): Promise<void> => {
    const existing = await projectUserRepo.findOne({
      where: { projectId, userId, deletedAt: IsNull() },
    });
    if (existing) return;
    await projectUserRepo.save(
      projectUserRepo.create({
        projectId,
        userId,
        projectRole: projectRole ?? null,
      }),
    );
  };
  await ensureProjectUser(p1.id, manager.id, 'Manager');
  await ensureProjectUser(p2.id, manager.id, 'Manager');
  await ensureProjectUser(p1.id, field.id, 'Field');
  await ensureProjectUser(p1.id, trade.id, 'Trade');
  await ensureProjectUser(p2.id, trade.id, 'Trade');

  await ensureTask({
    description: 'External fascia paint',
    projectId: p1.id,
    statusId: openStatus.id,
    priorityId: highPriority.id,
    levelId: level2.id,
    tradeId: painterTrade.id,
    createdByUserId: field.id,
    notes: 'Open flow seed task',
  });
  await ensureTask({
    description: 'Internal wall skim coat',
    projectId: p1.id,
    statusId: openStatus.id,
    priorityId: mediumPriority.id,
    levelId: level1.id,
    tradeId: electricianTrade.id,
    createdByUserId: field.id,
    assignedToUserId: trade.id,
    notes: 'Assigned to trade user',
  });
  await ensureTask({
    description: 'Switchboard install',
    projectId: p2.id,
    statusId: completedStatus.id,
    priorityId: lowPriority.id,
    levelId: level1.id,
    tradeId: painterTrade.id,
    createdByUserId: field.id,
    assignedToUserId: trade.id,
    notes: 'Completed flow seed task',
  });

  // Project-wise custom filters (matches HTML idea)
  const ensureProjectFilter = async (projectId: string, name: string, subs: string[]) => {
    const existing = await filterCategoryRepo.findOne({
      where: { projectId, name, deletedAt: IsNull() },
    });
    const cat =
      existing ??
      (await filterCategoryRepo.save(
        filterCategoryRepo.create({
          projectId,
          code: `custom_${name.toLowerCase().replace(/\s+/g, '_')}`,
          name,
          isSystemCategory: false,
        }),
      ));
    let order = 1;
    for (const s of subs) {
      const key = s.toLowerCase().replace(/\s+/g, '_');
      await ensureFilterOption(cat.id, `opt_${key}`, s, order++);
    }
  };
  await ensureProjectFilter(p1.id, 'Zone', ['North', 'South', 'East', 'West']);
  await ensureProjectFilter(p2.id, 'Floor', ['Ground', 'First', 'Second']);

  await dataSource.destroy();
  console.log('Seed completed');
}

run().catch(async (error) => {
  console.error(error);
  if (dataSource.isInitialized) {
    await dataSource.destroy();
  }
  process.exit(1);
});
