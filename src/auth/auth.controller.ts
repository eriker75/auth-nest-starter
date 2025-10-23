import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Endpoint to perform user login
   * POST /auth/login
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: 200,
    description: 'Successful login',
    schema: {
      example: {
        success: true,
        message: 'Login successful',
        user: {
          id: 'uuid',
          email: 'user@example.com',
          username: 'john_doe',
          firstName: 'John',
          lastName: 'Doe',
          isOnline: true,
          isActive: true,
          isVerified: true,
        },
        // token: 'jwt_token_here'
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async login(@Body() loginDto: LoginUserDto) {
    return this.authService.login(loginDto);
  }

  /**
   * Endpoint to perform user logout
   * POST /auth/logout
   * Requires authentication (JWT Guard - to be implemented)
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User logout' })
  // @UseGuards(JwtAuthGuard) // Uncomment when JWT Guard is implemented
  @ApiResponse({
    status: 200,
    description: 'Successful logout',
  })
  async logout(@Request() req) {
    // TODO: Get userId from decoded JWT token
    const userId = req.user?.id || 'user-id-placeholder';
    return this.authService.logout(userId);
  }

  /**
   * Endpoint to validate token
   * GET /auth/validate
   * Requires authentication (JWT Guard - to be implemented)
   */
  @Get('validate')
  @ApiOperation({ summary: 'Validate JWT token' })
  // @UseGuards(JwtAuthGuard) // Uncomment when JWT Guard is implemented
  @ApiResponse({
    status: 200,
    description: 'Valid token',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired token',
  })
  async validateToken(@Request() req) {
    return {
      success: true,
      message: 'Valid token',
      user: req.user,
    };
  }

  /**
   * Endpoint to refresh token
   * POST /auth/refresh
   * Requires authentication (JWT Guard - to be implemented)
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh JWT token' })
  // @UseGuards(JwtAuthGuard) // Uncomment when JWT Guard is implemented
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  async refreshToken(@Request() req) {
    const userId = req.user?.id || 'user-id-placeholder';
    return this.authService.refreshToken(userId);
  }

  /**
   * Endpoint to get authenticated user profile
   * GET /auth/profile
   * Requires authentication (JWT Guard - to be implemented)
   */
  @Get('profile')
  @ApiOperation({ summary: 'Get authenticated user profile' })
  // @UseGuards(JwtAuthGuard) // Uncomment when JWT Guard is implemented
  @ApiResponse({
    status: 200,
    description: 'User profile',
  })
  @ApiResponse({
    status: 401,
    description: 'Not authenticated',
  })
  async getProfile(@Request() req) {
    return {
      success: true,
      user: req.user,
    };
  }
}
