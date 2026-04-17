import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';

import { SoftDeleteTimestamps } from '../shared';
import { Task } from '../task/task.entities';
import { Project } from './project.entities';

@Entity('filters')
export class ProjectDynamicFilter extends SoftDeleteTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 200 })
  name!: string;

  @Column({ type: 'boolean', name: 'has_sub_filters', default: false })
  hasSubFilters!: boolean;

  @Column({ type: 'boolean', name: 'is_multi_select', default: false })
  isMultiSelect!: boolean;

  @OneToMany(() => SubFilterEntity, (s) => s.filter)
  subFilters!: SubFilterEntity[];

  @OneToMany(() => FilterProject, (fp) => fp.filter)
  projects!: FilterProject[];
}

@Entity('filter_projects')
@Index('uq_filter_projects_filter_project', ['filterId', 'projectId'], {
  unique: true,
})
export class FilterProject {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'filter_id' })
  filterId!: string;

  @ManyToOne(() => ProjectDynamicFilter, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'filter_id' })
  filter!: ProjectDynamicFilter;

  @Column({ type: 'uuid', name: 'project_id' })
  projectId!: string;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project!: Project;
}

@Entity('sub_filters')
export class SubFilterEntity extends SoftDeleteTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'filter_id' })
  filterId!: string;

  @ManyToOne(() => ProjectDynamicFilter, (f) => f.subFilters, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'filter_id' })
  filter!: ProjectDynamicFilter;

  @Column({ type: 'varchar', length: 200 })
  name!: string;
}

@Entity('task_filters')
export class TaskFilterRow extends SoftDeleteTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'task_id' })
  taskId!: string;

  @ManyToOne(() => Task, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task!: Task;

  @Column({ type: 'uuid', name: 'filter_id' })
  filterId!: string;

  @ManyToOne(() => ProjectDynamicFilter, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'filter_id' })
  filterDef!: ProjectDynamicFilter;

  @Column({ type: 'uuid', name: 'sub_filter_id', nullable: true })
  subFilterId?: string | null;

  @ManyToOne(() => SubFilterEntity, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'sub_filter_id' })
  subFilter?: SubFilterEntity | null;

  @Column({ type: 'varchar', length: 4000, name: 'text_value', nullable: true })
  textValue?: string | null;
}

export const DYNAMIC_PROJECT_FILTER_ENTITIES = [
  ProjectDynamicFilter,
  FilterProject,
  SubFilterEntity,
  TaskFilterRow,
];
