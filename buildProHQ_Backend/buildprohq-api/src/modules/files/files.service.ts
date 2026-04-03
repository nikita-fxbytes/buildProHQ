import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FilesService implements OnModuleInit {
  private readonly logger = new Logger(FilesService.name);
  readonly uploadDir: string;

  constructor(private readonly config: ConfigService) {
    this.uploadDir = path.join(process.cwd(), 'uploads');
  }

  onModuleInit(): void {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
      this.logger.log(`Created upload directory: ${this.uploadDir}`);
    }
  }

  resolveStoredPath(filename: string): string {
    return path.join(this.uploadDir, filename);
  }

  getMaxFileBytes(): number {
    const mb = this.config.get<number>('MAX_FILE_SIZE_MB') ?? 10;
    return mb * 1024 * 1024;
  }
}
