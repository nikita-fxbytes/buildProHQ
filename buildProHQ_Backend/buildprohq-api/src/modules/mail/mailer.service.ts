import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);

  constructor(private readonly config: ConfigService) {}

  private getTransport() {
    const host = this.config.get<string>('SMTP_HOST') ?? '';
    const user = this.config.get<string>('SMTP_USER') ?? '';
    const pass = this.config.get<string>('SMTP_PASS') ?? '';
    const port = this.config.get<number>('SMTP_PORT') ?? 587;

    if (!host || !user || !pass) return null;

    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  async sendSetPasswordEmail(params: {
    to: string;
    fullName?: string;
    link: string;
  }) {
    const from = this.config.get<string>('SMTP_FROM') ?? '';
    const transport = this.getTransport();
    if (!transport || !from) {
      this.logger.warn(
        `SMTP not configured; skipping invite email to ${params.to}. Link: ${params.link}`,
      );
      return;
    }

    const subject = 'Set your BuildPro HQ password';
    const greeting = params.fullName ? `Hi ${params.fullName},` : 'Hi,';
    const text = `${greeting}\n\nYou’ve been invited to BuildPro HQ.\n\nSet your password using this link:\n${params.link}\n\nIf you didn’t expect this email, you can ignore it.\n`;
    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.5;color:#111827">
        <p>${greeting}</p>
        <p>You’ve been invited to <strong>BuildPro HQ</strong>.</p>
        <p>
          <a href="${params.link}" style="display:inline-block;background:#F5A623;color:#fff;text-decoration:none;padding:10px 14px;border-radius:8px;font-weight:700">
            Set password
          </a>
        </p>
        <p style="font-size:12px;color:#6B7280">If you didn’t expect this email, you can ignore it.</p>
      </div>
    `.trim();

    await transport.sendMail({
      from,
      to: params.to,
      subject,
      text,
      html,
    });
  }
}
