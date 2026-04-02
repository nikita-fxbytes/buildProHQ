import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../../infrastructure/persistence/typeorm/entities/notification/notification.entities';
import type { AuthUser } from '../../infrastructure/common/interfaces/auth-user.interface';
import { QueryNotificationsDto } from './dto/query-notifications.dto';
import { MESSAGES } from '../../infrastructure/common/constants/messages';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async findAll(user: AuthUser, query: QueryNotificationsDto) {
    const qb = this.notificationRepository
      .createQueryBuilder('n')
      .where('n.user_id = :userId', { userId: user.id });

    if (query.isRead !== undefined) {
      qb.andWhere('n.is_read = :isRead', { isRead: query.isRead === 'true' ? 1 : 0 });
    }

    qb.orderBy('n.created_at', 'DESC');

    const offset = (query.page - 1) * query.limit;
    const [items, total] = await Promise.all([
      qb.clone().offset(offset).limit(query.limit).getMany(),
      qb.clone().getCount(),
    ]);

    return {
      items,
      meta: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit),
      },
      message: MESSAGES.NOTIFICATIONS.RETRIEVED,
    };
  }

  async markAsRead(id: string, user: AuthUser) {
    const notification = await this.notificationRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!notification) {
      throw new NotFoundException(MESSAGES.COMMON.NOT_FOUND);
    }

    await this.notificationRepository.update(id, {
      isRead: true,
      readAt: new Date(),
    });

    return { id, isRead: true, message: MESSAGES.NOTIFICATIONS.MARKED_READ };
  }

  async markAllAsRead(user: AuthUser) {
    await this.notificationRepository.update(
      { userId: user.id, isRead: false },
      { isRead: true, readAt: new Date() },
    );

    return { success: true, message: MESSAGES.NOTIFICATIONS.ALL_MARKED_READ };
  }
}
