import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ActiveUserType } from '../interfaces/Active-user-type.interface';

export const ActiveUser = createParamDecorator(
  (field: keyof ActiveUserType | undefined, context: ExecutionContext) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const user: ActiveUserType = request.user;

    return field ? user?.[field] : user;
  },
);
