import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

export type User = Prisma.UserGetPayload<{
  include: {
    roles: true;
    professional?: true;
    patient?: true;
  };
}>;

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user as User;

    if (!user) {
      throw new InternalServerErrorException('User not found (request)');
    }

    return !data ? user : user[data];
  },
);