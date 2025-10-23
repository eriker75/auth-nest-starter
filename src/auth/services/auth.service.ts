import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaPostgresService } from '../../database/prisma-postgres.service';
import { LoginUserDto } from '../dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaPostgresService) {}

  /**
   * Method to perform user login
   * @param loginDto - Login data (email/username, password, role)
   * @returns Authenticated user and token (JWT implementation pending)
   */
  async login(loginDto: LoginUserDto) {
    const { email, username, password, role } = loginDto;

    // Validate that at least email or username are present
    if (!email && !username) {
      throw new BadRequestException(
        'Email or username are required for login',
      );
    }

    // Find user by email or username
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          email ? { email } : {},
          username ? { username } : {},
        ].filter((condition) => Object.keys(condition).length > 0),
      },
    });

    // Validate that user exists
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validate that user is active
    if (!user.isActive) {
      throw new UnauthorizedException(
        'User is inactive, contact administrator',
      );
    }

    // TODO: Implement password comparison with bcrypt
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // For now simple comparison (INSECURE - development only)
    const isPasswordValid = password === user.password;

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        isOnline: true,
      },
    });

    // TODO: Implement JWT token generation
    // const token = this.jwtService.sign({ id: user.id, email: user.email, role });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return {
      success: true,
      message: 'Login successful',
      user: userWithoutPassword,
      // token, // Uncomment when JWT is implemented
    };
  }

  /**
   * Method to perform user logout
   * @param userId - User ID
   * @returns Logout confirmation
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
      message: 'Logout successful',
    };
  }

  /**
   * Method to validate a JWT token
   * @param token - JWT token
   * @returns Decoded user data from token
   */
  async validateToken(token: string) {
    // TODO: Implement JWT validation
    // return this.jwtService.verify(token);
    throw new BadRequestException('Token validation not implemented');
  }

  /**
   * Method to refresh a JWT token
   * @param userId - User ID
   * @returns New JWT token
   */
  async refreshToken(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid user');
    }

    // TODO: Implement new JWT token generation
    // const token = this.jwtService.sign({ id: user.id, email: user.email });

    return {
      success: true,
      message: 'Token refreshed',
      // token, // Uncomment when JWT is implemented
    };
  }
}



