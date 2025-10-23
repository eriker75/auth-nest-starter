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
   * Endpoint para realizar login
   * POST /auth/login
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login de usuario' })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    schema: {
      example: {
        success: true,
        message: 'Login exitoso',
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
    description: 'Credenciales inválidas',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  async login(@Body() loginDto: LoginUserDto) {
    return this.authService.login(loginDto);
  }

  /**
   * Endpoint para realizar logout
   * POST /auth/logout
   * Requiere autenticación (JWT Guard - por implementar)
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout de usuario' })
  // @UseGuards(JwtAuthGuard) // Descomentar cuando se implemente JWT Guard
  @ApiResponse({
    status: 200,
    description: 'Logout exitoso',
  })
  async logout(@Request() req) {
    // TODO: Obtener userId del token JWT decodificado
    const userId = req.user?.id || 'user-id-placeholder';
    return this.authService.logout(userId);
  }

  /**
   * Endpoint para validar token
   * GET /auth/validate
   * Requiere autenticación (JWT Guard - por implementar)
   */
  @Get('validate')
  @ApiOperation({ summary: 'Validar token JWT' })
  // @UseGuards(JwtAuthGuard) // Descomentar cuando se implemente JWT Guard
  @ApiResponse({
    status: 200,
    description: 'Token válido',
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido o expirado',
  })
  async validateToken(@Request() req) {
    return {
      success: true,
      message: 'Token válido',
      user: req.user,
    };
  }

  /**
   * Endpoint para refrescar token
   * POST /auth/refresh
   * Requiere autenticación (JWT Guard - por implementar)
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refrescar token JWT' })
  // @UseGuards(JwtAuthGuard) // Descomentar cuando se implemente JWT Guard
  @ApiResponse({
    status: 200,
    description: 'Token refrescado exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido',
  })
  async refreshToken(@Request() req) {
    const userId = req.user?.id || 'user-id-placeholder';
    return this.authService.refreshToken(userId);
  }

  /**
   * Endpoint para obtener el perfil del usuario autenticado
   * GET /auth/profile
   * Requiere autenticación (JWT Guard - por implementar)
   */
  @Get('profile')
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  // @UseGuards(JwtAuthGuard) // Descomentar cuando se implemente JWT Guard
  @ApiResponse({
    status: 200,
    description: 'Perfil del usuario',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado',
  })
  async getProfile(@Request() req) {
    return {
      success: true,
      user: req.user,
    };
  }
}
