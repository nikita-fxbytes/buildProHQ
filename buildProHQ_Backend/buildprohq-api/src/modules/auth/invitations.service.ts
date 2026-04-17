import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { IsNull, Repository } from 'typeorm';
import { MESSAGES } from '../../infrastructure/common/constants/messages';
import {
  InvitationStatus,
  User,
  UserInvitation,
} from '../../infrastructure/persistence/typeorm/entities';
import { MailerService } from '../mail/mailer.service';

type InviteStatusCode = 'pending' | 'accepted';

@Injectable()
export class InvitationsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserInvitation)
    private readonly invitationRepository: Repository<UserInvitation>,
    @InjectRepository(InvitationStatus)
    private readonly invitationStatusRepository: Repository<InvitationStatus>,
    private readonly config: ConfigService,
    private readonly mailer: MailerService,
  ) {}

  private async ensureStatus(code: InviteStatusCode, name: string) {
    const existing = await this.invitationStatusRepository.findOne({
      where: { code, deletedAt: IsNull() },
      select: { id: true, code: true },
    });
    if (existing) return existing;
    const row = this.invitationStatusRepository.create({ code, name });
    return await this.invitationStatusRepository.save(row);
  }

  private hashToken(token: string): string {
    const secret = this.config.getOrThrow<string>('INVITE_TOKEN_SECRET');
    return createHash('sha256').update(`${secret}:${token}`).digest('hex');
  }

  private async findInviteByToken(token: string) {
    const v = (token ?? '').trim();
    if (!v) throw new NotFoundException(MESSAGES.COMMON.NOT_FOUND);

    const tokenHash = this.hashToken(v);
    return await this.invitationRepository.findOne({
      where: { tokenHash, deletedAt: IsNull() },
      order: { createdAt: 'DESC' as any },
    });
  }

  async validateToken(token: string) {
    const invite = await this.findInviteByToken(token);
    if (!invite) throw new NotFoundException(MESSAGES.COMMON.NOT_FOUND);
    if (invite.acceptedAt)
      throw new BadRequestException(MESSAGES.INVITES.ALREADY_USED);
    if (invite.expiresAt.getTime() < Date.now())
      throw new BadRequestException(MESSAGES.INVITES.EXPIRED);
    return { message: MESSAGES.INVITES.TOKEN_VALID };
  }

  async createAndSendInvite(params: {
    invitedUserId: string;
    invitedEmail: string;
    invitedByUserId: string;
    fullName?: string;
  }) {
    const pendingStatus = await this.ensureStatus('pending', 'Pending');

    const token = randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(token);
    const expiresHours = this.config.get<number>('INVITE_EXPIRES_HOURS') ?? 48;
    const expiresAt = new Date(Date.now() + expiresHours * 60 * 60 * 1000);

    const invite = this.invitationRepository.create({
      invitedUserId: params.invitedUserId,
      invitedEmail: params.invitedEmail.toLowerCase(),
      invitationStatusId: pendingStatus.id,
      tokenHash,
      expiresAt,
      acceptedAt: null,
      invitedByUserId: params.invitedByUserId,
      createdBy: params.invitedByUserId,
      updatedBy: params.invitedByUserId,
    });
    await this.invitationRepository.save(invite);

    const frontend = this.config
      .getOrThrow<string>('FRONTEND_BASE_URL')
      .replace(/\/+$/, '');
    const link = `${frontend}/set-password?token=${encodeURIComponent(token)}`;

    await this.mailer.sendSetPasswordEmail({
      to: params.invitedEmail,
      fullName: params.fullName,
      link,
    });

    return { token, link };
  }

  async acceptInvite(token: string, password: string) {
    const match = await this.findInviteByToken(token);
    if (!match) throw new NotFoundException(MESSAGES.COMMON.NOT_FOUND);
    if (match.acceptedAt)
      throw new BadRequestException(MESSAGES.INVITES.ALREADY_USED);
    if (match.expiresAt.getTime() < Date.now())
      throw new BadRequestException(MESSAGES.INVITES.EXPIRED);

    const acceptedStatus = await this.ensureStatus('accepted', 'Accepted');

    if (!match.invitedUserId)
      throw new BadRequestException(MESSAGES.COMMON.BAD_REQUEST);
    const user = await this.userRepository.findOne({
      where: { id: match.invitedUserId, deletedAt: IsNull() },
      select: { id: true },
    });
    if (!user) throw new NotFoundException(MESSAGES.COMMON.NOT_FOUND);

    const passwordHash = await bcrypt.hash(password, 10);
    await this.userRepository.update(user.id, { passwordHash });

    await this.invitationRepository.update(match.id as any, {
      invitationStatusId: acceptedStatus.id,
      acceptedAt: new Date(),
    });

    return { message: MESSAGES.INVITES.PASSWORD_SET_SUCCESS };
  }
}
