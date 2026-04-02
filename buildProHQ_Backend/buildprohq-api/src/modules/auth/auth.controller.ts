import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import * as express from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from '../../infrastructure/common/decorators/current-user.decorator';
import type { AuthUser } from '../../infrastructure/common/interfaces/auth-user.interface';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Authenticate user and set JWT in HttpOnly cookie' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: 'Login successful',
    schema: {
      example: {
        success: true,
        statusCode: 201,
        message: 'Logged in successfully',
        data: {
          user: {
            id: 'b0d31f13-7363-47e2-835c-ae815b892b49',
            email: 'manager@buildpro.com',
            fullName: 'Manager Admin',
            role: 'manager',
            userTypeCode: 'management',
          },
          message: 'Logged in successfully',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    schema: {
      example: {
        success: false,
        statusCode: 401,
        message: 'Invalid credentials',
        error: {
          code: 'UNAUTHORIZED',
          details: [],
        },
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'User is not allowed to sign in from this portal',
    schema: {
      example: {
        success: false,
        statusCode: 403,
        message:
          'This account does not have access to this portal. Sign in using the correct portal for your role.',
        error: {
          code: 'FORBIDDEN',
          details: [],
        },
      },
    },
  })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: express.Response,
  ) {
    const result = await this.authService.login(dto);
    this.authService.setAuthCookie(response, result.accessToken);
    return {
      user: result.user,
      message: result.message,
    };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Clear authentication cookie' })
  @ApiOkResponse({
    description: 'Logout successful',
    schema: {
      example: {
        success: true,
        statusCode: 201,
        message: 'Logged out successfully',
        data: {
          message: 'Logged out successfully',
        },
      },
    },
  })
  logout(@Res({ passthrough: true }) response: express.Response) {
    this.authService.clearAuthCookie(response);
    return { message: 'Logged out successfully' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get currently authenticated user context' })
  @ApiOkResponse({
    description: 'Authenticated user context',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        message: 'Success',
        data: {
          id: 'b0d31f13-7363-47e2-835c-ae815b892b49',
          email: 'manager@buildpro.com',
          fullName: 'Manager Admin',
          role: 'manager',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing token',
    schema: {
      example: {
        success: false,
        statusCode: 401,
        message: 'Unauthorized',
        error: {
          code: 'UNAUTHORIZED',
          details: [],
        },
      },
    },
  })
  me(@CurrentUser() user: AuthUser) {
    return user;
  }
}
