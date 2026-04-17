import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import type { Request } from 'express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../infrastructure/common/guards/roles.guard';
import { Roles } from '../../infrastructure/common/decorators/roles.decorator';
import { Public } from '../../infrastructure/common/decorators/public.decorator';
import { MESSAGES } from '../../infrastructure/common/constants/messages';
import { FilesService } from './files.service';
import {
  ALLOWED_IMAGE_MIME_TYPES,
  assertImageUploadAllowed,
} from '../../infrastructure/common/file-upload/image-upload.validation';

function extFromOriginal(name: string): string {
  const n = path.extname(name).toLowerCase();
  if (n === '.jpeg' || n === '.jpg') return '.jpg';
  if (n === '.png') return '.png';
  if (n === '.webp') return '.webp';
  if (n === '.heic' || n === '.heif') return n;
  return n || '.bin';
}

function ensureUploadDir(): string {
  const dir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

@ApiTags('files')
@Controller({ path: 'files', version: '1' })
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager', 'field_user', 'trade_user')
  @ApiOperation({
    summary: 'Upload an image file (before/after photos)',
    description:
      'Stores the file on disk and returns metadata for use with POST /tasks/:id/attachments.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: { type: 'string', format: 'binary', description: 'Image file' },
      },
    },
  })
  @ApiOkResponse({
    description: 'Upload succeeded',
    schema: {
      example: {
        success: true,
        statusCode: 201,
        message: 'Success',
        data: {
          fileUrl:
            'http://localhost:3000/api/v1/files/a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg',
          fileName: 'photo.jpg',
          fileType: 'jpg',
          mimeType: 'image/jpeg',
          fileSize: 245678,
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          cb(null, ensureUploadDir());
        },
        filename: (_req, file, cb) => {
          const ext = extFromOriginal(file.originalname);
          cb(null, `${randomUUID()}${ext}`);
        },
      }),
      limits: { fileSize: 12 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        const okMime = ALLOWED_IMAGE_MIME_TYPES.has(file.mimetype);
        const okExt = /\.(jpe?g|png|webp|heic|heif)$/i.test(file.originalname);
        if (!okMime && !okExt) {
          return cb(
            new BadRequestException(MESSAGES.FILES.INVALID_TYPE),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Req() req: Request,
  ) {
    const maxBytes = this.filesService.getMaxFileBytes();
    if (!file) {
      throw new BadRequestException(MESSAGES.FILES.REQUIRED);
    }
    try {
      assertImageUploadAllowed(
        file.mimetype,
        file.originalname,
        file.size,
        maxBytes,
      );
    } catch (e) {
      fs.unlink(this.filesService.resolveStoredPath(file.filename), () => {});
      throw e;
    }

    const host = req.get('host') ?? 'localhost';
    const proto = req.protocol;
    const base = `${proto}://${host}`;
    const ext = path.extname(file.filename).replace('.', '') || 'jpg';
    const fileUrl = `${base}/api/v1/files/${file.filename}`;

    return {
      message: MESSAGES.COMMON.SUCCESS,
      data: {
        fileUrl,
        fileName: file.originalname,
        fileType: ext,
        mimeType: file.mimetype,
        fileSize: file.size,
      },
    };
  }

  @Get(':filename')
  @Public()
  @ApiOperation({
    summary: 'Download an uploaded file by stored name',
    description:
      'Public read for browser image tags; filenames are non-guessable UUIDs.',
  })
  async getFile(
    @Param('filename') filename: string,
    @Res({ passthrough: false }) res: Response,
  ) {
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.[a-z0-9]+$/i.test(
        filename,
      )
    ) {
      throw new NotFoundException(MESSAGES.FILES.NOT_FOUND);
    }
    const full = this.filesService.resolveStoredPath(filename);
    if (!fs.existsSync(full)) {
      throw new NotFoundException(MESSAGES.FILES.NOT_FOUND);
    }
    return res.sendFile(path.resolve(full));
  }
}
