import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { META_ROLES } from '../decorators/role.decorator';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

export type User = Prisma.UserGetPayload<{
  include: {
    roles: true;
    professional?: true;
    patient?: true;
  };
}>;

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  private async getUserRoles(userId: string): Promise<string[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { roles: true },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user.roles.map((role) => role.name);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const validRoles = this.reflector.get<string[]>(
      META_ROLES,
      context.getHandler(),
    );

    if (!validRoles || validRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if (!user) throw new BadRequestException('User not found');

    const userRoles = await this.getUserRoles(user.id);
    const hasValidRole = validRoles.some((role) => userRoles.includes(role));

    if (!hasValidRole) {
      const userName =
        [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email;
      throw new ForbiddenException(
        `User ${userName} needs one of these roles: [${validRoles.join(', ')}]`,
      );
    }

    return true;
  }
}