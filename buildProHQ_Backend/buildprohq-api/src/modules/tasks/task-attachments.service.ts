import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Attachment } from '../../infrastructure/persistence/typeorm/entities';
import { AddAttachmentDto } from './dto/add-attachment.dto';
import { MESSAGES } from '../../infrastructure/common/constants/messages';

@Injectable()
export class TaskAttachmentsService {
  private readonly logger = new Logger(TaskAttachmentsService.name);

  // Backend safety cap to prevent unbounded attachments per task.
  // Frontend already enforces its own (smaller) limits.
  private static readonly MAX_ATTACHMENTS_PER_TASK = 40;

  constructor(
    @InjectRepository(Attachment)
    private readonly attachmentRepository: Repository<Attachment>,
  ) {}

  private async ensureCanAdd(
    taskId: string,
    countToAdd: number,
  ): Promise<void> {
    if (countToAdd <= 0) return;

    const existingCount = await this.attachmentRepository.count({
      where: { taskId, deletedAt: IsNull() },
    });

    if (
      existingCount + countToAdd >
      TaskAttachmentsService.MAX_ATTACHMENTS_PER_TASK
    ) {
      this.logger.warn(
        `Attachment cap exceeded for task ${taskId}: existing=${existingCount}, toAdd=${countToAdd}`,
      );
      throw new BadRequestException(MESSAGES.TASKS.ATTACHMENTS_TOO_MANY);
    }
  }

  /**
   * Central helper for adding a single attachment using the typed DTO
   * (used by POST /tasks/:id/attachments).
   */
  async addOneFromDto(
    taskId: string,
    dto: AddAttachmentDto,
    userId: string,
  ): Promise<void> {
    await this.ensureCanAdd(taskId, 1);

    const row = this.attachmentRepository.create({
      entityType: 'task',
      entityId: taskId,
      taskId,
      fileUrl: dto.fileUrl,
      fileName: dto.fileName,
      fileType: dto.fileType,
      mimeType: dto.mimeType ?? null,
      fileSize: String(dto.fileSize),
      uploadedBy: userId,
      isBefore: Boolean(dto.isBefore),
      isAfter: Boolean(dto.isAfter),
      createdBy: userId,
      updatedBy: userId,
    });

    await this.attachmentRepository.save(row);
  }

  /**
   * Central helper for creating "after" attachments from an array of URLs,
   * used by the task completion flow. Keeps existing behaviour (fileType
   * reported as "image" and fileSize left unspecified/zero) while adding
   * a shared cap and creation path.
   */
  async addAfterPhotosFromUrls(
    taskId: string,
    urls: string[],
    userId: string,
  ): Promise<void> {
    const cleaned = urls.filter((u) => !!u && typeof u === 'string');
    if (cleaned.length === 0) return;

    await this.ensureCanAdd(taskId, cleaned.length);

    const rows = cleaned.map((url) =>
      this.attachmentRepository.create({
        entityType: 'task',
        entityId: taskId,
        taskId,
        fileUrl: url,
        fileName: url.split('/').pop() || 'verification_photo',
        fileType: 'image',
        // Keep existing behaviour: completion attachments did not previously
        // record an explicit file size; store "0" as a neutral placeholder.
        fileSize: '0',
        uploadedBy: userId,
        isBefore: false,
        isAfter: true,
        createdBy: userId,
        updatedBy: userId,
      }),
    );

    await this.attachmentRepository.save(rows);
  }
}
