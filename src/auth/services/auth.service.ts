import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaPostgreService } from '../../database/prisma-postgre.service';
import { LoginUserDto } from '../dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaPostgreService) {}

  /**
   * Método para realizar el login de un usuario
   * @param loginDto - Datos de login (email/username, password, role)
   * @returns Usuario autenticado y token (por implementar JWT)
   */
  async login(loginDto: LoginUserDto) {
    const { email, username, password, role } = loginDto;

    // Validar que al menos email o username estén presentes
    if (!email && !username) {
      throw new BadRequestException(
        'Email o username son requeridos para el login',
      );
    }

    // Buscar el usuario por email o username
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          email ? { email } : {},
          username ? { username } : {},
        ].filter((condition) => Object.keys(condition).length > 0),
      },
    });

    // Validar que el usuario exista
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Validar que el usuario esté activo
    if (!user.isActive) {
      throw new UnauthorizedException(
        'Usuario inactivo, contacte al administrador',
      );
    }

    // TODO: Implementar comparación de contraseñas con bcrypt
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // Por ahora comparación simple (INSEGURO - solo para desarrollo)
    const isPasswordValid = password === user.password;

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Actualizar último login
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        isOnline: true,
      },
    });

    // TODO: Implementar generación de JWT token
    // const token = this.jwtService.sign({ id: user.id, email: user.email, role });

    // Remover password de la respuesta
    const { password: _, ...userWithoutPassword } = user;

    return {
      success: true,
      message: 'Login exitoso',
      user: userWithoutPassword,
      // token, // Descomentar cuando se implemente JWT
    };
  }

  /**
   * Método para realizar el logout de un usuario
   * @param userId - ID del usuario
   * @returns Confirmación de logout
   */
  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isOnline: false,
      },
    });

    return {
      success: true,
      message: 'Logout exitoso',
    };
  }

  /**
   * Método para validar un token JWT
   * @param token - Token JWT
   * @returns Datos del usuario decodificados del token
   */
  async validateToken(token: string) {
    // TODO: Implementar validación de JWT
    // return this.jwtService.verify(token);
    throw new BadRequestException('Validación de token no implementada');
  }

  /**
   * Método para refrescar un token JWT
   * @param userId - ID del usuario
   * @returns Nuevo token JWT
   */
  async refreshToken(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario no válido');
    }

    // TODO: Implementar generación de nuevo JWT token
    // const token = this.jwtService.sign({ id: user.id, email: user.email });

    return {
      success: true,
      message: 'Token refrescado',
      // token, // Descomentar cuando se implemente JWT
    };
  }
}



